export const promptConfig = {
  // Cấu trúc mặc định: Linh hoạt, hiện đại, phù hợp cho mọi chủ thể.
  general: {
    "1. Chủ thể chính (Main Subject)": {
      "Loại chủ thể": { "placeholder": "Con người, động vật, robot, quái vật, đồ vật...", "value": "" },
      "Số lượng & Tương tác": { "placeholder": "Một mình, một cặp đôi đang trò chuyện, một nhóm...", "value": "" }
    },
    "2. Đặc điểm Vật lý (Physical Attributes)": {
      "2.1 Hình dáng & Kích thước": {
        "Hình dáng tổng thể": { "placeholder": "Cao, lùn, to lớn, mảnh mai, tròn, góc cạnh...", "value": "" },
        "Tỷ lệ & Cấu trúc": { "placeholder": "Cân đối, đầu to, tay chân dài, cấu trúc cơ khí phức tạp...", "value": "" }
      },
      "2.2 Vật liệu & Bề mặt": {
        "Chất liệu cấu thành": { "placeholder": "Hữu cơ, kim loại, đá, gỗ, năng lượng...", "value": "" },
        "Đặc điểm bề mặt": { "placeholder": "Nhẵn bóng, thô ráp, có vết sẹo, trong suốt, phát sáng...", "value": "" },
        "Màu sắc & Họa tiết": { "placeholder": "Đỏ rực, xanh lam, vằn, ngụy trang, ánh kim, đa sắc...", "value": "" }
      }
    },
    "3. Hành vi & Trạng thái (Behavior & State)": {
      "Tư thế & Chuyển động": { "placeholder": "Đứng, ngồi, bay, chiến đấu, lén lút, bất động...", "value": "" },
      "Biểu cảm & Tâm trạng": { "placeholder": "Vui, buồn, giận dữ, tò mò, vô cảm, máy móc...", "value": "" },
      "Hành động & Mục đích": { "placeholder": "Đang quan sát, chế tạo một vật, uống nước, quét radar...", "value": "" }
    },
    "4. Môi trường & Bối cảnh (Environment & Context)": {
      "Địa điểm": { "placeholder": "Trong rừng rậm, thành phố cyberpunk, vũ trụ, phòng thí nghiệm...", "value": "" },
      "Thời gian & Thời tiết": { "placeholder": "Hoàng hôn, bão tuyết, tương lai xa, giữa trưa...", "value": "" },
      "Không khí & Cảm giác": { "placeholder": "Bí ẩn, hùng vĩ, hỗn loạn, tĩnh lặng, công nghệ cao...", "value": "" }
    },
    "5. Phong cách & Kỹ thuật (Style & Technique)": {
      "Phong cách nghệ thuật": { "Lựa chọn": { "options": "Nhiếp ảnh chân thực, Điện ảnh, Anime, 3D Render, Nghệ thuật số, Tranh sơn dầu, Tranh màu nước, Concept Art, Cyberpunk, Steampunk, Fantasy, Low Poly, Hyperrealism", "value": "" }},
      "Ánh sáng": { "Lựa chọn": { "options": "Tự nhiên ban ngày, Giờ vàng hoàng hôn, Ánh trăng, Đèn Neon, Ánh nến, Mây mù u ám, Studio", "value": "" }},
      // THÊM MỚI
      "Góc Nhìn & Phối Cảnh": { "Lựa chọn": { "options": "Cận cảnh (Close-up), Chân dung (Portrait), Toàn cảnh (Full shot), Viễn cảnh (Long shot), Nhìn từ trên xuống (High-angle), Nhìn từ dưới lên (Low-angle), Ngang tầm mắt (Eye-level)", "value": "" }},
      "Chất lượng & Tiêu cự": { "Lựa chọn": { "options": "Siêu chi tiết (Hyperdetailed), 8K, Lấy nét sắc cạnh (Sharp focus), Lấy nét mềm (Soft focus)", "value": "" }},
      "Tỉ lệ khung hình": { "Lựa chọn": { "options": "16:9, 9:16, 1:1, 4:3, 21:9", "value": "" }}
    }
  },

  // Cấu trúc Tiền sử: Linh hoạt cho mọi chủ thể trong bối cảnh hoang dã, nguyên thủy.
  prehistoric: {
     "1. Chủ thể & Phân loại khoa học": {
      "Tên chủ thể / Giống loài": { "placeholder": "Homo habilis, Tyrannosaurus Rex, Smilodon, Trilobite...", "value": "" },
      "Kỷ nguyên / Niên đại": { "placeholder": "Kỷ Jura, Kỷ Phấn trắng, Thế Pleistocene...", "value": "" }
    },
    "2. Mô tả Hình thái & Giải phẫu": {
        "2.1 Cấu trúc cơ thể": {
            "Kích thước & Tầm vóc": { "placeholder": "Cao 2 mét, dài 12 mét, nặng 8 tấn, khổng lồ...", "value": "" },
            "Đặc điểm xương khớp": { "placeholder": "Hộp sọ lớn, gờ mày nổi rõ, chi trước ngắn, có gai trên lưng...", "value": "" }
        },
        "2.2 Đặc điểm Sinh học & Bề mặt": {
            "Lớp da/vỏ/lông": { "placeholder": "Da có vảy sừng, lông vũ nguyên thủy, vỏ giáp xương, bộ lông dày...", "value": "" },
            "Vũ khí tự nhiên": { "placeholder": "Răng nanh dài, móng vuốt sắc nhọn, sừng, đuôi có gai...", "value": "" },
            "Màu sắc & Ngụy trang": { "placeholder": "Màu đất, hoa văn đốm để ẩn nấp, màu sặc sỡ để giao phối...", "value": "" }
        }
    },
     "3. Hành vi & Môi trường sống": {
      "Hành vi điển hình": { "placeholder": "Săn mồi theo đàn, ăn cỏ, làm tổ, di cư, phục kích...", "value": "" },
      "Môi trường sống (Habitat)": { "placeholder": "Rừng rậm nhiệt đới, đầm lầy, đồng bằng ngập nước, hang động...", "value": "" },
      "Không khí & Cảm giác": { "placeholder": "Nguyên thủy, nguy hiểm, tĩnh lặng, hùng vĩ, hoang vu...", "value": "" }
    },
    "4. Phong cách & Kỹ thuật": {
      "Phong cách nghệ thuật": { "Lựa chọn": { "options": "Nhiếp ảnh chân thực, Điện ảnh, Anime, 3D Render, Nghệ thuật số, Tranh sơn dầu, Tranh màu nước, Concept Art, Cyberpunk, Steampunk, Fantasy, Low Poly, Hyperrealism", "value": "" }},
      "Ánh sáng": { "Lựa chọn": { "options": "Tự nhiên ban ngày, Giờ vàng hoàng hôn, Ánh trăng, Đèn Neon, Ánh nến, Mây mù u ám, Studio", "value": "" }},
      // THÊM MỚI
      "Góc Nhìn & Phối Cảnh": { "Lựa chọn": { "options": "Cận cảnh (Close-up), Chân dung (Portrait), Toàn cảnh (Full shot), Viễn cảnh (Long shot), Nhìn từ trên xuống (High-angle), Nhìn từ dưới lên (Low-angle), Ngang tầm mắt (Eye-level)", "value": "" }},
      "Chất lượng & Tiêu cự": { "Lựa chọn": { "options": "Siêu chi tiết (Hyperdetailed), 8K, Lấy nét sắc cạnh (Sharp focus), Lấy nét mềm (Soft focus)", "value": "" }},
      "Tỉ lệ khung hình": { "Lựa chọn": { "options": "16:9, 9:16, 1:1, 4:3, 21:9", "value": "" }}
    }
  }
};

export const outputRules = `
**Output Rules**:
1. For each language, combine all descriptions into a single, continuous block of text. DO NOT include any titles, headings, or markdown bullet points.
2. The final paragraph MUST include a comprehensive negative prompt generated by you.
3. You MUST reply with ONLY a valid JSON object containing two keys: "vietnamese" and "english".`;