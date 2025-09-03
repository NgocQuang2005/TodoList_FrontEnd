// src/composables/useImageUpload.js
import { ref } from "vue";
import Pica from "pica";

export function useImageUpload() {
  const imageFile = ref(null);
  const imagePreview = ref(null);
  const isProcessing = ref(false);
  const pica = new Pica();

  // Reset tất cả state
  const resetImage = () => {
    imageFile.value = null;
    imagePreview.value = null;
    isProcessing.value = false;
  };

  // Tự động resize ảnh để không vượt quá 1MB
  const resizeImageToTargetSize = async (file, maxSizeInMB = 1) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = async () => {
        try {
          let currentQuality = 0.9;
          let currentWidth = 200;
          let currentHeight = 200;
          let finalBlob = null;

          // Hàm resize với kích thước và quality cụ thể
          const resizeWithParams = async (width, height, quality) => {
            const tempCanvas = document.createElement("canvas");
            const finalCanvas = document.createElement("canvas");

            // Tính toán để crop center
            const { width: imgWidth, height: imgHeight } = img;
            const scale = Math.max(width / imgWidth, height / imgHeight);
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            // Canvas tạm với kích thước scaled
            tempCanvas.width = scaledWidth;
            tempCanvas.height = scaledHeight;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

            // Canvas cuối cùng với kích thước mong muốn
            finalCanvas.width = width;
            finalCanvas.height = height;

            // Sử dụng Pica để resize chất lượng cao
            await pica.resize(tempCanvas, finalCanvas, {
              quality: 3,
              alpha: true,
            });

            return new Promise((resolve) => {
              finalCanvas.toBlob(
                (blob) => {
                  resolve(blob);
                },
                "image/jpeg",
                quality
              );
            });
          };

          // Bước 1: Thử với kích thước ban đầu 200x200
          finalBlob = await resizeWithParams(
            currentWidth,
            currentHeight,
            currentQuality
          );

          // Bước 2: Nếu vẫn quá lớn, giảm quality
          while (
            finalBlob.size > maxSizeInMB * 1024 * 1024 &&
            currentQuality > 0.1
          ) {
            currentQuality -= 0.1;
            finalBlob = await resizeWithParams(
              currentWidth,
              currentHeight,
              currentQuality
            );
          }

          // Bước 3: Nếu vẫn quá lớn, giảm kích thước
          while (
            finalBlob.size > maxSizeInMB * 1024 * 1024 &&
            currentWidth > 50
          ) {
            currentWidth = Math.floor(currentWidth * 0.8);
            currentHeight = Math.floor(currentHeight * 0.8);
            currentQuality = 0.7; // Reset quality khi giảm size

            finalBlob = await resizeWithParams(
              currentWidth,
              currentHeight,
              currentQuality
            );

            // Tiếp tục giảm quality nếu cần
            while (
              finalBlob.size > maxSizeInMB * 1024 * 1024 &&
              currentQuality > 0.1
            ) {
              currentQuality -= 0.1;
              finalBlob = await resizeWithParams(
                currentWidth,
                currentHeight,
                currentQuality
              );
            }
          }

          // Bước 4: Nếu vẫn quá lớn, dùng quality tối thiểu
          if (finalBlob.size > maxSizeInMB * 1024 * 1024) {
            finalBlob = await resizeWithParams(
              Math.max(currentWidth, 50),
              Math.max(currentHeight, 50),
              0.1
            );
          }

          console.log(
            `Ảnh đã được resize: ${currentWidth}x${currentHeight}, quality: ${currentQuality}, size: ${(
              finalBlob.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );

          resolve(finalBlob);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Không thể tải ảnh"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Xử lý khi chọn file
  const handleFileSelect = async (file) => {
    if (!file) {
      resetImage();
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Vui lòng chọn file ảnh hợp lệ");
    }

    // Không giới hạn file size ban đầu, sẽ tự động resize
    console.log(
      `File gốc: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );

    isProcessing.value = true;

    try {
      // Tự động resize ảnh về tối đa 1MB
      const resizedBlob = await resizeImageToTargetSize(file, 1);

      // Tạo File object từ blob
      const resizedFile = new File([resizedBlob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      imageFile.value = resizedFile;
      imagePreview.value = URL.createObjectURL(resizedBlob);

      console.log(
        `File sau resize: ${(resizedFile.size / 1024 / 1024).toFixed(2)}MB`
      );
    } catch (error) {
      resetImage();
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  // Cleanup preview URL khi component unmount
  const cleanup = () => {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    resetImage();
  };

  return {
    imageFile,
    imagePreview,
    isProcessing,
    handleFileSelect,
    resetImage,
    cleanup,
  };
}
