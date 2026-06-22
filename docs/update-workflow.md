# LACONET 网站更新与发布流程

网站部署在 GitHub Pages：

https://hollywuzh.github.io/LACONETHomepage/

日常更新遵循一个原则：先改本地文件，确认页面正常，再提交并推送到 GitHub。

## 常用更新位置

- 组会安排：`data/meetings.csv`
- 文献索引：`data/papers.csv`
- 文献解读正文：`notes/*.md`
- 实验室设备台账：`data/equipment.csv`
- 设备使用记录：`data/equipment-usage.csv`
- 汇报模板：`templates/*.md`

## 本地预览

在项目目录 `E:\laconethomepage` 中运行：

```powershell
python -m http.server 8080
```

浏览器打开：

```text
http://127.0.0.1:8080/
```

检查首页、文献解读库、模板页和设备登记页是否正常。

## 提交并推送

确认页面无误后，在 `E:\laconethomepage` 中运行：

```powershell
git status
git add .
git commit -m "Update seminar information"
git push
```

推送完成后等待 GitHub Pages 自动刷新。通常几十秒到几分钟后，线上页面会更新。

## 推荐提交信息

- 更新组会安排：`Update seminar schedule`
- 更新文献解读：`Add literature note`
- 更新模板：`Update presentation templates`
- 更新设备信息：`Update equipment registry`

## 注意事项

- 不要直接修改网页生成后的缓存内容，优先修改 CSV 或 Markdown 源文件。
- 公开仓库中不要放敏感会议密码、私人手机号、未授权论文 PDF 或内部数据。
- 如果腾讯会议链接、PPT、PDF 只限组内使用，建议在 CSV 中写 `内部链接` 或使用受控网盘链接。
