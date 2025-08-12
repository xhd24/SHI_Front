import { BrowserQRCodeReader } from 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.10/+esm';

export function initZxingQrDropReader(options = {}) {
  const { dropTargetSelector = 'body', outputSelector = '#qr-output' } = options;

  const dropZone = document.querySelector(dropTargetSelector);
  if (!dropZone) {
    console.error('[ZXing] 드롭 대상 요소를 찾을 수 없습니다:', dropTargetSelector);
    return;
  }

  const outputElem = document.querySelector(outputSelector) || (() => {
    const div = document.createElement('div');
    div.id = 'qr-output';
    document.body.appendChild(div);
    return div;
  })();

  const reader = new BrowserQRCodeReader();

  dropZone.style.border = '2px dashed #888';
  dropZone.style.padding = '50px';
  dropZone.style.textAlign = 'center';
  dropZone.style.marginTop = '20px';
  dropZone.innerHTML = dropZone.innerHTML || '📂 QR 이미지 파일을 드롭하세요';

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = '#f0f0f0';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = '';
  });

  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.style.background = '';

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      outputElem.textContent = '이미지 파일만 가능합니다.';
      return;
    }

    const imgURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = imgURL;

    img.onload = async () => {
      const MAX_SIZE = 400;
      const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height, 1);
      const width = Math.floor(img.width * scale);
      const height = Math.floor(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const result = await reader.decodeFromCanvas(canvas);
        outputElem.textContent = 'QR 코드 내용: ' + result.text;
        window.qrCodeResult = result.text;

        if (typeof window.onQrCodeDecoded === 'function') {
          window.onQrCodeDecoded(result.text);
        }
      } catch (err) {
        console.warn('[ZXing] QR 인식 실패 (canvas):', err);
        outputElem.textContent = 'QR 코드를 인식할 수 없습니다.';
      }
    };
  });
}
