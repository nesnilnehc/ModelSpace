# 推广图更新流程

本文档说明如何更新 README 使用的推广图 `docs/assets/cognitive-atlas-promo.png`。

## 步骤

1. **启动本地服务**
   ```bash
   python3 -m http.server 8080
   # 或 npx serve
   ```

2. **打开 Atlas 页面**
   - 访问 `http://localhost:8080/cognitive-atlas.html`

3. **选择推广图视角（推荐）**
   - 点击顶栏「推广图视角」按钮，将相机切换到适合 README 的固定角度

4. **可选：收敛范围**
   - 若需突出部分对象，可在「检索与聚焦」中先查找对象，再按 Atlas 单元缩小范围
   - 默认展示全部对象

5. **导出图片**
   - 点击顶栏「导出图片」
   - 浏览器会下载 `cognitive-atlas-YYYY-MM-DD.png`

6. **保存为推广图**
   - 将下载的 PNG 重命名并覆盖 `docs/assets/cognitive-atlas-promo.png`

## 导出特性

- **透明背景**：导出时自动关闭雾效、星场、纯色背景，输出透明 PNG
- **裁剪**：仅截取认知空间范围（三轴包围盒），去除多余边距
- **轴标签放大**：导出时轴刻度与标题标签会自动放大 1.25×，提升可读性
- **无 UI**：导出时隐藏顶栏、筛选面板、详情面板、工具提示

## 可调参数

在 `src/app.js` 的 `VISUAL_CONFIG` 中可调整：

- `exportCropMargin`：导出裁剪边距（像素）
- `exportAxisLabelScale`：导出时轴标签缩放倍数
