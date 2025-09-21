export const promptConfig = {
  // =========================
  // COMMON (dùng cho mọi nhánh)
  // =========================
  common: {
    "meta_controls": {
      "output_goal": { "placeholder": "photoreal / cinematic / scientific-illustration / 3D", "value": "", "required": true, "enum": ["photoreal","cinematic","scientific-illustration","3D"], "priority": 1 },
      "style_strength": { "placeholder": "0–1", "value": "", "required": false, "priority": 3 },
      "random_seed": { "placeholder": "Số nguyên để tái lập", "value": "", "required": false, "priority": 3 },
      "variation": { "placeholder": "low / medium / high", "value": "", "required": false, "enum": ["low","medium","high"], "priority": 3 },
      "unit_prefs": {
        "length": { "value": "cm", "enum": ["cm","m"] },
        "mass": { "value": "kg", "enum": ["kg","ton"] },
        "time": { "value": "BP", "enum": ["CE","BCE","BP"] }
      }
    },
    "composition": {
      "framing": { "placeholder": "rule-of-thirds / centered / symmetry", "value": "", "required": false, "enum": ["rule-of-thirds","centered","symmetry"], "priority": 3 },
      "subject_emphasis": { "placeholder": "foreground / midground / background", "value": "", "required": false, "enum": ["foreground","midground","background"], "priority": 3 },
      "depth_of_field": { "placeholder": "shallow / medium / deep", "value": "", "required": false, "enum": ["shallow","medium","deep"], "priority": 3 },
      "motion": { "placeholder": "freeze / motion-blur / none", "value": "", "required": false, "enum": ["freeze","motion-blur","none"], "priority": 3 },
      "lighting_ratio": { "placeholder": "key:fill:rim (vd 1:2:0.5)", "value": "", "priority": 2 },
      "color_palette": { "placeholder": "amber & teal / neutral gray / pastel", "value": "", "priority": 2 }
    },
    "camera_render": {
      "focal_length": { "placeholder": "35mm / 50mm / 85mm / tele / macro", "value": "", "required": false, "priority": 3 },
      "aperture": { "placeholder": "f/1.8 – f/16", "value": "", "required": false, "priority": 3 },
      "shutter_iso": { "placeholder": "1/250s, ISO 400 (tuỳ chọn)", "value": "", "required": false, "priority": 4 },
      "render_engine": { "placeholder": "Cycles / Redshift / Octane (nếu 3D)", "value": "", "required": false, "priority": 4 },
      "materials": { "placeholder": "PBR / SSS (nếu 3D)", "value": "", "required": false, "priority": 4 },
      "global_illumination": { "placeholder": "on / off", "value": "", "required": false, "enum": ["on","off"], "priority": 4 }
    },
    "engine": {
      "target": { "placeholder": "sdxl / sd3 / midjourney / firefly / dalle", "value": "", "required": true, "enum": ["sdxl","sd3","midjourney","firefly","dalle"], "priority": 1 },
      "sdxl": { "steps": 30, "cfg": 6.5, "sampler": "DPM++ 2M", "denoise_strength": 0.6, "img2img_strength": 0.55 },
      "sd3":  { "steps": 28, "cfg": 5.5, "sampler": "Euler a", "denoise_strength": 0.55, "img2img_strength": 0.55 },
      "midjourney": { "stylize": 100, "quality": 1, "chaos": 0, "version": "v6" },
      "firefly": { "content_credentials": true },
      "dalle": { "quality": "hd" }
    },
    "reference_inputs": {
      "ref_image_urls": { "placeholder": "[] URL ảnh tham chiếu", "value": "", "priority": 2 },
      "masks": [
        { "name": "face", "polygon": [], "feather": 8,  "op": "replace", "order": 1 },
        { "name": "background", "polygon": [], "feather": 12, "op": "replace", "order": 2 }
      ]
    },
    "constraints_ethics": {
      "consent_required": { "placeholder": "true / false (đối với ảnh người)", "value": "", "required": false },
      "ip_restriction": { "placeholder": "Tránh bản quyền / thương hiệu", "value": "", "required": false },
      "privacy_filters": { "placeholder": "Xoá watermark / PII", "value": "", "required": false },
      "age_gate": {
        "explicit_age_verified": { "placeholder": "true/false", "value": "" },
        "nsfw_policy": { "placeholder": "block / allow-sfw-only", "value": "", "enum": ["block","allow-sfw-only"] }
      }
    },
    "negative_presets": {
      "portrait": "over-smooth skin, plastic skin, extra fingers, bad hands, warped ears, harsh flash, raccoon eyes",
      "wildlife": "undesired motion blur, unnatural pose, baited setup, duplicate limbs, over-sharpened feathers",
      "museum_recon": "cartoonish, speculative patterns without evidence, fantasy armor, toy-like materials",
      "cinematic": "banding, blown highlights, excessive sharpening, washed-out colors, posterization"
    },
    "negative_prompt_template": {
      "preset": { "placeholder": "portrait / wildlife / museum_recon / cinematic", "value": "", "enum": ["portrait","wildlife","museum_recon","cinematic"], "priority": 1 },
      "anatomy_errors": { "placeholder": "extra fingers, wrong anatomy", "value": "", "priority": 2 },
      "quality_errors": { "placeholder": "blurry, pixelated, low-res, watermark, jpeg artifacts", "value": "", "priority": 2 },
      "style_mismatch": { "placeholder": "cartoon, oversaturated, unrealistic (nếu cần ảnh thật)", "value": "", "priority": 2 }
    },
    "uncertainty_tag": {
      "confidence": { "placeholder": "high / medium / low", "value": "", "enum": ["high","medium","low"] },
      "basis": { "placeholder": "fossil / analog / speculative", "value": "", "enum": ["fossil","analog","speculative"] },
      "uncertainty_fields": { "placeholder": "['coloration','behavior']", "value": "" }
    },
    "batch": { "images": 4, "variation": "medium", "keep_seed": true },
    "output": { "format": "PNG", "color_space": "sRGB", "max_side_px": 4096, "keep_exif": false },
    "output_rules_overrides": {
      "max_chars_per_language": 1200,
      "strip_markdown": true,
      "ascii_only": false,
      "collapse_whitespace": true,
      "field_order_strategy": "priority-then-branch"
    },
    "compat_rules": [
      { "if": { "meta_controls.output_goal": "scientific-illustration" }, "then": { "negative_prompt_template.preset": "museum_recon" } }
    ]
  },

  // =========================
  // 1) CON NGƯỜI HIỆN ĐẠI
  // =========================
  modern_human: {
    "identity_details": {
      "age_range": { "placeholder": "child / teen / young-adult / adult / middle-aged / senior / ~25", "value": "", "required": true, "priority": 1 },
      "gender": { "placeholder": "male / female / non-binary / unspecified", "value": "", "required": true, "priority": 1 },
      "ethnicity_origin": { "placeholder": "Asian, African, European, Latino, Mixed...", "value": "", "required": false, "priority": 2 },
      "skin_tone": { "placeholder": "Fitzpatrick I–VI", "value": "", "required": false, "priority": 2 }
    },
    "face_hair": {
      "face_shape": { "placeholder": "oval / square / round / heart", "value": "" },
      "features": { "placeholder": "high-bridge nose, full lips, thick eyebrows, freckles...", "value": "" },
      "makeup_level": { "placeholder": "none / soft / glam", "value": "", "enum": ["none","soft","glam"] },
      "hair_style": { "placeholder": "short / long / bob / ponytail / undercut", "value": "" },
      "hair_texture": { "placeholder": "straight / wavy / curly / coily", "value": "" },
      "facial_hair": { "placeholder": "clean-shaven / stubble / full beard / mustache", "value": "" },
      "hand_details": { "placeholder": "well-posed hands, natural fingers, avoid deformities", "value": "" },
      "pose_keypoints_format": { "placeholder": "COCO / OpenPose", "value": "" },
      "pose_keypoints": { "placeholder": "[[x,y,confidence],...]", "value": "" }
    },
    "body_wear": {
      "body_type": { "placeholder": "ectomorph / mesomorph / endomorph / athletic", "value": "" },
      "height_estimate": { "placeholder": "~170 cm", "value": "" },
      "outfit_style": { "placeholder": "streetwear / formal / couture / national attire", "value": "", "priority": 2 },
      "fit": { "placeholder": "oversized / tailored / slim", "value": "" },
      "accessories": { "placeholder": "glasses, watch, earrings, handbag, hat", "value": "" },
      "action_pose": { "placeholder": "walking, running, selfie, typing on laptop...", "value": "" },
      "pose_ref": { "placeholder": "URL/pose keypoints", "value": "" },
      "background_control": { "placeholder": "solid backdrop #color / natural scene", "value": "" }
    },
    "context": {
      "setting": { "placeholder": "studio, cafe, street, office, park", "value": "", "priority": 2 },
      "lighting": { "placeholder": "natural daylight / neon / softbox key-fill-rim", "value": "", "priority": 2 },
      "mood": { "placeholder": "elegant, warm, energetic, cinematic", "value": "" }
    },
    "minimal_required": [
      "identity_details.age_range",
      "identity_details.gender",
      "body_wear.outfit_style",
      "context.setting",
      "context.lighting",
      "common.meta_controls.output_goal",
      "common.engine.target"
    ]
  },

  // =========================
  // 2) CON NGƯỜI TIỀN SỬ
  // =========================
  prehistoric_human: {
    "anthropology": {
      "taxon": { "placeholder": "Homo sapiens / Neanderthal / Denisovan (nếu giả định)", "value": "", "required": false },
      "period": { "placeholder": "Paleolithic / Mesolithic / Neolithic / Bronze Age / Iron Age", "value": "", "required": true, "priority": 1 },
      "culture": { "placeholder": "Hòa Bình / Sơn Vi / Sa Huỳnh / Đông Sơn / (vùng khác tương ứng)", "value": "", "required": true, "priority": 1 }
    },
    "site_dating": {
      "site_name": { "placeholder": "Tên di chỉ (VD: Hang Xóm Trại, Lascaux)", "value": "", "required": false },
      "stratigraphy": { "placeholder": "tầng đá vôi, phù sa cổ, trầm tích hang động", "value": "", "required": false },
      "dating_method": { "placeholder": "C14 / OSL / dendrochronology", "value": "", "required": false },
      "date_range": { "placeholder": "khoảng 20,000 BP (±σ)", "value": "", "required": false }
    },
    "morphology": {
      "cranial_features": { "placeholder": "gờ mày nổi, hộp sọ dài/ngắn", "value": "" },
      "stature": { "placeholder": "chiều cao ước tính", "value": "" },
      "limb_proportions": { "placeholder": "tỷ lệ chi dài/ngắn", "value": "" },
      "pathology": { "placeholder": "dấu vết bệnh lý xương (nếu có)", "value": "" }
    },
    "material_culture": {
      "lithic_industry": { "placeholder": "Oldowan / Acheulean / Mousterian / Hoabinhian", "value": "", "priority": 2 },
      "tool_wear_patterns": { "placeholder": "vết mòn / vi mòn trên lưỡi đá", "value": "" },
      "metallurgy": { "placeholder": "đồng thau / sắt (nếu thời kim loại)", "value": "" },
      "ceramics": { "placeholder": "gốm văn thừng, khắc vạch, tô màu khoáng", "value": "" },
      "ornaments": { "placeholder": "hạt xương, vòng đá, răng thú, body paint", "value": "" },
      "rock_art": { "placeholder": "tranh hang động, pigment đỏ/đen/okre", "value": "" }
    },
    "lifeways": {
      "subsistence": { "placeholder": "săn bắt–hái lượm / đánh cá / nông nghiệp sơ kỳ", "value": "" },
      "rituals": { "placeholder": "mai táng, biểu tượng, tín ngưỡng vật tổ", "value": "" },
      "dwelling": { "placeholder": "hang, lán trại, nhà sàn sơ kỳ", "value": "" },
      "palaeoenvironment": { "placeholder": "băng hà/hậu băng hà, rừng rậm, savanna", "value": "" }
    },
    "references": [
      { "type": "paper", "title": "", "doi": "", "year": "" }
    ],
    "uncertainty": { "confidence": "medium" },
    "minimal_required": [
      "anthropology.period",
      "anthropology.culture",
      "material_culture.lithic_industry",
      "common.meta_controls.output_goal",
      "common.engine.target"
    ]
  },

  // =========================
  // 3) SINH VẬT HIỆN ĐẠI
  // =========================
  modern_creature: {
    "taxonomy": {
      "common_name": { "placeholder": "Hổ Bengal, chó Shiba, đại bàng hói...", "value": "", "required": true, "priority": 1 },
      "latin_name": { "placeholder": "Panthera tigris tigris, Canis lupus familiaris...", "value": "", "required": false },
      "breed": { "placeholder": "Shiba Inu, Maine Coon, Arabian horse...", "value": "", "required": false },
      "sex_age": { "placeholder": "juvenile / adult / male / female", "value": "", "required": false }
    },
    "morphology": {
      "size": { "placeholder": "to lớn / nhỏ bé (kèm ước tính)", "value": "" },
      "coat_pattern": { "placeholder": "sọc / vằn / đốm / trơn; màu sắc", "value": "" },
      "distinctive_traits": { "placeholder": "bờm, mỏ khoằm, tai cụp/dựng, râu dài", "value": "" }
    },
    "behavior_ecology": {
      "pose_action": { "placeholder": "rình mồi, chạy, bay lượn, bơi", "value": "" },
      "vocalization": { "placeholder": "gầm/gừ/tiếng hót (nếu cần)", "value": "" },
      "sociality": { "placeholder": "đơn độc / bầy đàn", "value": "" },
      "habitat": { "placeholder": "rừng mưa, savanna, alpine, đô thị", "value": "", "priority": 2 },
      "time_of_day": { "placeholder": "bình minh / hoàng hôn / đêm", "value": "" },
      "season": { "placeholder": "mùa khô / mưa / đông", "value": "" },
      "IUCN_status": { "placeholder": "LC/NT/VU/EN/CR", "value": "" },
      "no_baiting": { "placeholder": "true/false", "value": "" }
    },
    "imaging": {
      "genre": { "placeholder": "wildlife / macro / bird-in-flight / underwater", "value": "", "priority": 2 },
      "lens": { "placeholder": "tele 300–600mm / macro 100mm", "value": "" },
      "distance_to_subject": { "placeholder": "xa / vừa / gần (tele cảm nhận phối cảnh)", "value": "" },
      "post": { "placeholder": "natural color / HDR subtle / film grain", "value": "" }
    },
    "minimal_required": [
      "taxonomy.common_name",
      "behavior_ecology.habitat",
      "behavior_ecology.time_of_day",
      "imaging.genre",
      "common.engine.target"
    ]
  },

  // =========================
  // 4) SINH VẬT TIỀN SỬ
  // =========================
  prehistoric_creature: {
    "systematics": {
      "latin_name": { "placeholder": "Tyrannosaurus rex, Smilodon fatalis...", "value": "", "required": true, "priority": 1 },
      "common_term": { "placeholder": "khủng long bạo chúa, mèo răng kiếm...", "value": "", "required": false },
      "clade": { "placeholder": "Theropoda / Sauropoda / Mammalia (Felidae...)", "value": "", "required": false },
      "geological_period": { "placeholder": "Triassic / Jurassic / Cretaceous / Pleistocene...", "value": "", "required": true, "priority": 1 },
      "formation": { "placeholder": "Hell Creek / Yixian / La Brea Tar Pits...", "value": "", "required": false }
    },
    "specimen_context": {
      "holotype_id": { "placeholder": "MOR 555...", "value": "" },
      "locality": { "placeholder": "địa danh phát hiện", "value": "" },
      "skeletal_completeness": { "placeholder": "ví dụ 70% / hộp sọ hoàn chỉnh", "value": "" },
      "taphonomy": { "placeholder": "articulated / disarticulated / weathered", "value": "" },
      "references": [
        { "type": "paper", "title": "", "doi": "", "year": "" },
        { "type": "museum_record", "accession": "" }
      ]
    },
    "functional_morphology": {
      "skull_dentition": { "placeholder": "hàm khỏe, răng cưa / hình nón, hốc mắt lớn", "value": "" },
      "limb_function": { "placeholder": "cursorial / fossorial / aquatic / volant", "value": "" },
      "integument": { "placeholder": "vảy / lông vũ nguyên thủy / giáp xương", "value": "", "priority": 2 },
      "weapons": { "placeholder": "móng vuốt / sừng / đuôi chùy", "value": "" },
      "growth_stage": { "placeholder": "juvenile / subadult / adult", "value": "" },
      "coloration": { "placeholder": "tông đất, countershading (giả định hợp lý)", "value": "" }
    },
    "palaeoecology": {
      "diet": { "placeholder": "carnivore / herbivore / omnivore", "value": "" },
      "behavior": { "placeholder": "đơn độc / bầy đàn / ấp trứng", "value": "" },
      "palaeoenvironment": { "placeholder": "floodplain, coastal forest, volcanic ash beds", "value": "" },
      "trackways": { "placeholder": "dấu chân (nếu có)", "value": "" },
      "coprolites": { "placeholder": "phân hoá thạch (nếu có)", "value": "" }
    },
    "visualization": {
      "style": { "placeholder": "scientific illustration / museum reconstruction / cinematic realism / 3D render", "value": "", "priority": 2 },
      "lighting": { "placeholder": "golden hour / dust storm / overcast / studio", "value": "" },
      "shot": { "placeholder": "low-angle / eye-level / long shot / close-up", "value": "" },
      "quality": { "placeholder": "8K / hyperdetailed / sharp focus", "value": "" }
    },
    "inference_control": {
      "plausibility_guardrails": { "placeholder": "không thêm chi tiết chưa có bằng chứng", "value": "" },
      "confidence": { "placeholder": "high/medium/low", "value": "", "enum": ["high","medium","low"] }
    },
    "minimal_required": [
      "systematics.latin_name",
      "systematics.geological_period",
      "functional_morphology.integument",
      "inference_control.confidence",
      "common.engine.target"
    ]
  },
   landscape_scene: {
    "geography": {
      "landforms": { "placeholder": "mountains, rivers, rice paddies, coastline, forests...", "value": "", "priority": 1 },
      "terrain": { "placeholder": "flat plain, rolling hills, rocky cliffs...", "value": "" },
      "water": { "placeholder": "river, lake, sea, waterfall...", "value": "" }
    },
    "season_time": {
      "season": { "placeholder": "spring, rainy, harvest, winter...", "value": "", "priority": 2 },
      "time_of_day": { "placeholder": "sunrise, noon, sunset, night...", "value": "", "priority": 2 },
      "weather": { "placeholder": "clear, cloudy, foggy, rainy, stormy...", "value": "" }
    },
    "cultural_elements": {
      "structures": { "placeholder": "temple, pagoda, bridge, communal house, market...", "value": "" },
      "festivities": { "placeholder": "festival flags, village fair, lanterns...", "value": "" },
      "agriculture": { "placeholder": "harvested rice fields, buffalo plowing, farmers working...", "value": "" }
    },
    "atmosphere": {
      "tone": { "placeholder": "serene, mystical, bustling, festive, majestic...", "value": "", "priority": 3 },
      "lighting": { "placeholder": "golden hour glow, moonlight, diffused sunlight, misty dawn...", "value": "" },
      "color_palette": { "placeholder": "warm amber & teal, pastel dawn, deep green tones...", "value": "" }
    },
    "visualization": {
      "style": { "placeholder": "photorealism, cinematic realism, painterly, hyperrealistic 8K...", "value": "", "priority": 2 },
      "shot": { "placeholder": "panoramic wide shot, bird’s-eye view, aerial drone style...", "value": "", "priority": 2 },
      "depth": { "placeholder": "deep focus, layered foreground-midground-background...", "value": "" },
      "quality": { "placeholder": "8K, ultra-detailed, HDR, hyperrealistic...", "value": "" }
    },
    "minimal_required": [
      "geography.landforms",
      "season_time.time_of_day",
      "atmosphere.tone",
      "visualization.style",
      "visualization.shot",
      "common.engine.target"
    ]
  }
};

export const outputRules = `
**Output Rules**:
1. For each language, combine all descriptions into a single, continuous block of text. DO NOT include any titles, headings, or markdown bullet points.
2. The final paragraph MUST include a comprehensive negative prompt generated by you.
3. You MUST reply with ONLY a valid JSON object containing two keys: "vietnamese" and "english".`;