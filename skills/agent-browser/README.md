# Agent-Browser Skill

Skill tự động hóa trình duyệt cho Claude Code, sử dụng công cụ agent-browser từ Vercel Labs.

## Cài đặt đã hoàn thành

✅ agent-browser CLI v0.4.3 (global npm package)
✅ Chromium browser binaries
✅ Skill file tại `~/.claude/skills/agent-browser/SKILL.md`

## Cách sử dụng trong Claude Code

Skill này cho phép Claude tự động điều khiển trình duyệt để:
- Mở và điều hướng websites
- Điền form tự động
- Click buttons, links
- Chụp screenshots
- Extract dữ liệu từ trang web
- Testing web applications

## Ví dụ sử dụng

### 1. Mở trang web và lấy thông tin
```bash
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser get title
agent-browser close
```

### 2. Điền form
```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# Giả sử snapshot trả về: textbox "Email" [ref=e1], button "Submit" [ref=e2]
agent-browser fill @e1 "user@example.com"
agent-browser click @e2
agent-browser close
```

### 3. Chụp screenshot
```bash
agent-browser open https://example.com
agent-browser screenshot output.png
agent-browser close
```

## Lệnh thường dùng

- `agent-browser open <url>` - Mở URL
- `agent-browser snapshot -i` - Lấy danh sách elements tương tác (với refs như @e1, @e2)
- `agent-browser click @e1` - Click element theo ref
- `agent-browser fill @e1 "text"` - Điền text vào input
- `agent-browser get text @e1` - Lấy text của element
- `agent-browser screenshot [path]` - Chụp màn hình
- `agent-browser close` - Đóng browser

## Tài liệu đầy đủ

- Documentation: https://agent-browser.dev
- GitHub: https://github.com/vercel-labs/agent-browser
- Skill file: ~/.claude/skills/agent-browser/SKILL.md

## Kiểm tra cài đặt

```bash
agent-browser --help
agent-browser open https://example.com
agent-browser get title
agent-browser close
```
