# Bug Report: JSON Message Format Sent to Telegram

## Mô tả vấn đề
Bot đang gửi raw JSON structure `[{'type': 'text', 'text': "..."}]` thay vì plain text content đến Telegram group.

## Root Cause Analysis

### Code Path đã traced

1. **Entry Point**: [`/Users/mac/tools/openclaw/src/infra/outbound/message-action-runner.ts`](file:///Users/mac/tools/openclaw/src/infra/outbound/message-action-runner.ts)
   - Line 677-681: `handleSendAction` đọc message parameter
   - Message được truyền xuống `executeSendAction`

2. **Send Action**: [`/Users/mac/tools/openclaw/src/infra/outbound/outbound-send-service.ts`](file:///Users/mac/tools/openclaw/src/infra/outbound/outbound-send-service.ts)
   - Line 119-134: `executeSendAction` gọi `sendMessage` với `content: params.message`

3. **Send Message**: [`/Users/mac/tools/openclaw/src/infra/outbound/message.ts`](file:///Users/mac/tools/openclaw/src/infra/outbound/message.ts)
   - Line 14-19: `sendMessage` tạo `normalizedPayloads` từ `{ text: params.content }`
   - **Đây là điểm quan trọng**: `params.content` được truyền trực tiếp vào `text` field

4. **Payload Normalization**: [`/Users/mac/tools/openclaw/src/infra/outbound/payloads.ts`](file:///Users/mac/tools/openclaw/src/infra/outbound/payloads.ts)
   - Line 40-68: `normalizeReplyPayloadsForDelivery` chỉ parse directives
   - Line 42: `parseReplyDirectives(payload.text ?? "")` - assumes text is STRING
   - **BUG**: Nếu `payload.text` là một object/array, nó sẽ KHÔNG được convert thành string

5. **Delivery**: [`/Users/mac/tools/openclaw/src/infra/outbound/deliver.ts`](file:///Users/mac/tools/openclaw/src/infra/outbound/deliver.ts)
   - Line 153-163: `sendText` được gọi với `text` parameter
   - Text được truyền xuống channel adapter (Telegram, Signal, etc.)

## Phát hiện chính xác

### Vấn đề từ Agent Response
Khi agent trả về response có structure:
```typescript
{
  content: [
    { type: 'text', text: 'Now let me read the research files...' }
  ]
}
```

**Bug xảy ra khi**: 
- Message được truyền vào `sendMessage` với `content` là một ARRAY thay vì STRING
- Code KHÔNG extract `.text` từ content array items
- Array được stringify (hoặc converted to string) và send thẳng đến Telegram

### Nơi cần fix

**Có 2 khả năng**:

#### Option 1: Fix ở Message Action Runner  
File: [`message-action-runner.ts:677-681`](file:///Users/mac/tools/openclaw/src/infra/outbound/message-action-runner.ts#L677-L681)

```typescript
// BEFORE (Line 677)
let message =
  readStringParam(params, "message", {
    required: !mediaHint && !hasCard,
    allowEmpty: true,
  }) ?? "";

// SHOULD BE:
let message = extractTextFromContent(
  readStringParam(params, "message", {
    required: !mediaHint && !hasCard,
    allowEmpty: true,
  }) ?? ""
);

// Helper function needed:
function extractTextFromContent(content: unknown): string {
  // If already string, return
  if (typeof content === 'string') return content;
  
  // If array of content blocks, extract text
  if (Array.isArray(content)) {
    return content
      .filter(block => block?.type === 'text' && typeof block.text === 'string')
      .map(block => block.text)
      .join('\n');
  }
  
  // If object with text property
  if (content && typeof content === 'object' && 'text' in content) {
    return String(content.text);
  }
  
  // Fallback: stringify
  return JSON.stringify(content);
}
```

#### Option 2: Fix ở Payload Normalization
File: [`payloads.ts:40-68`](file:///Users/mac/tools/openclaw/src/infra/outbound/payloads.ts#L40-L68)

```typescript
// Line 42-43
const parsed = parseReplyDirectives(payload.text ?? "");

// SHOULD check if payload.text is actually a content array FIRST
const textContent = extractTextFromPayload(payload.text);
const parsed = parseReplyDirectives(textContent);
```

## Chỗ gọi bug

Cần tìm xem **ai đang gọi** message action với `message` parameter là một array/object:

```bash
grep -r "message.*\[.*type.*text" /Users/mac/tools/openclaw/src --include="*.ts"
grep -r "content.*\[.*{.*type" /Users/mac/tools/openclaw/src --include="*.ts"
```

Hoặc có thể bug đến từ:
- **Agent tool execution** đang pass raw `content` array thay vì extracted text
- **Gateway relay** đang forward message không đúng format  
- **Session transcript** đang save/replay messages với wrong format

## Deep Analysis - FOUND ROOT CAUSE

### Source of Content Array

**File**: [`attempt.ts:107-108`](file:///Users/mac/tools/openclaw/src/agents/pi-embedded-runner/run/attempt.ts#L107-L108)

```typescript
// Convert string content to array format if needed
if (typeof msg.content === "string") {
  msg.content = [{ type: "text", text: msg.content }];
  didMutate = true;
}
```

**Mục đích**: Convert string content sang array format để support vision (image injection)

**Tác dụng phụ**: Message object bây giờ có `content` là ARRAY thay vì STRING

### readStringParam Limitation

**File**: [`common.ts:43-64`](file:///Users/mac/tools/openclaw/src/agents/tools/common.ts#L43-L64)

```typescript
export function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions = {},
) {
  const { required = false, trim = true, label = key, allowEmpty = false } = options;
  const raw = params[key];
  if (typeof raw !== "string") {  // ❌ BUG: không handle array
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;  // ❌ Returns undefined nếu raw là array/object
  }
  const value = trim ? raw.trim() : raw;
  if (!value && !allowEmpty) {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  return value;
}
```

**Vấn đề**: `readStringParam` KHÔNG biết cách extract text từ content array `[{type: 'text', text: '...'}]`

### Khi nào bug xảy ra?

1. Agent response có `content` array (từ attempt.ts line 108)
2. Response được pass vào tool execution
3. Tool params có `message` field là array `[{type: 'text', text: '...'}]`
4. `readStringParam(params, "message")` returns `undefined` (vì không phải string)
5. Fallback to empty string `""` hoặc stringify toàn bộ array
6. Array được gửi thẳng đến Telegram

## Recommendation: FIX Ở ĐÂU?

### ✅ KHUYẾN NGHỊ: Fix tại `readStringParam` (DEFENSIVE)

**File**: `/Users/mac/tools/openclaw/src/agents/tools/common.ts`

**Lý do**:
1. ✅ **Centralized**: Tất cả tools đều dùng `readStringParam` → fix 1 lần là đủ
2. ✅ **Defensive**: Bảo vệ mọi nơi sử dụng param `message`
3. ✅ **Backward compatible**: Không break existing code
4. ✅ **Future-proof**: Handle bất kỳ content array nào trong tương lai

**Code suggestion**:

```typescript
export function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions = {},
) {
  const { required = false, trim = true, label = key, allowEmpty = false } = options;
  let raw = params[key];
  
  // ✅ NEW: Extract text from content array if needed
  if (Array.isArray(raw)) {
    const textBlocks = raw.filter(
      (block): block is { type: string; text: string } =>
        block &&
        typeof block === 'object' &&
        'type' in block &&
        block.type === 'text' &&
        'text' in block &&
        typeof block.text === 'string'
    );
    if (textBlocks.length > 0) {
      raw = textBlocks.map(block => block.text).join('\n');
    }
  }
  
  if (typeof raw !== "string") {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  const value = trim ? raw.trim() : raw;
  if (!value && !allowEmpty) {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  return value;
}
```

### ❌ KHÔNG khuyến nghị: Fix tại attempt.ts

**Lý do**:
- ❌ Content array cần thiết cho vision support
- ❌ Sẽ break image injection logic
- ❌ Sẽ cần revert sau khi handle ở downstream

### ❌ KHÔNG khuyến nghị: Fix tại message-action-runner.ts

**Lý do**: 
- ❌ Chỉ fix cho message tool, không fix cho các tools khác
- ❌ Nhiều nơi khác cũng dùng readStringParam có thể gặp vấn đề tương tự
- ❌ Không defensive, dễ miss edge cases

## Summary

**Root cause**: `readStringParam` không biết extract text từ content array format `[{type: 'text', text: '...'}]`

**Best fix**: Update `readStringParam` để handle content array → extract text automatically

**Impact**: Fix 1 lần tại common.ts sẽ bảo vệ TẤT CẢ tools và message actions khỏi bug này
