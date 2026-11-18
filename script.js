<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>غواصة الجزرية - 50 سؤالاً</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            user-select: none;
            background-color: #001f3f;
        }

        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* خلفية البحر التي تتغير ألوانها عند الغوص */
        #ocean-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, #87CEEB 0%, #1E90FF 20%, #00008B 80%, #000033 100%);
            background-size: 100% 400%;
            background-position: 0% 0%;
            transition: background-position 1.5s ease-in-out;
            z-index: -1;
        }

        #hud {
            position: absolute;
            top: 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            background: rgba(255, 255, 255, 0.92);
            padding: 10px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 10;
            flex-wrap: wrap;
            justify-content: center;
        }

        .control-box { display: flex; gap: 10px; font-weight: bold; align-items: center; color: #001f3f; }
        select { padding: 5px 10px; border-radius: 5px; font-size: 14px; font-weight: bold; }

        .depth-meter {
            font-weight: bold; font-size: 16px; color: #001f3f;
            border-right: 2px solid #ccc; padding-right: 15px; margin-right: 5px;
        }

        button {
            padding: 10px 20px; cursor: pointer; background-color: #ff851b;
            color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 16px;
            transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            font-family: inherit;
        }
        button:hover:not(:disabled) { background-color: #ff6600; transform: translateY(-2px); }
        button:disabled { background-color: #999; cursor: not-allowed; }

        /* الغواصة وحركتها */
        #submarine-container {
            position: absolute;
            top: 25%;
            transition: top 1s ease-in-out;
        }

        #submarine {
            font-size: 100px;
            filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));
            animation: bobbing 3s ease-in-out infinite;
        }

        .dive-anim { animation: diveDown 1s ease-in-out !important; }

        @keyframes bobbing {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes diveDown {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(30px) rotate(15deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }

        #feedback-message {
            position: absolute; top: 42%; font-size: 32px; font-weight: bold;
            color: #ffdc00; text-shadow: 2px 2px 5px rgba(0,0,0,0.9);
            z-index: 20; text-align: center; padding: 0 20px;
            animation: popIn 1.8s ease-out forwards;
        }
        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.5); }
            20% { opacity: 1; transform: scale(1.15); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
        }

        /* المربع الحواري */
        .hidden { display: none !important; }
        #quiz-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 30, 0.85); display: flex; justify-content: center; align-items: center; z-index: 100;
        }
        .modal-content {
            background: white; padding: 25px; border-radius: 15px; width: 90%; max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8); text-align: center;
        }
        .lesson-box {
            background: #f0f8ff; padding: 15px; border-radius: 8px;
            border-right: 5px solid #0074d9; margin: 15px 0;
        }
        #lesson-text { font-size: 16px; line-height: 1.6; font-weight: bold; color: #001f3f; margin: 0; }
        #question-text { font-size: 19px; color: #111; margin: 15px 0; font-weight: bold; line-height: 1.5; }
        .badge {
            background: #39cccc; color: #001f3f; padding: 5px 12px;
            border-radius: 5px; font-weight: bold; font-size: 13px; display: inline-block;
        }
        #options { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
        .opt-btn { background-color: #0074d9; font-size: 16px; }
        .opt-btn:hover { background-color: #0056b3; }
    </style>
</head>
<body>

<div id="game-container">
    <div id="ocean-bg"></div>

    <!-- شريط التحكم العلوي -->
    <div id="hud">
        <div class="control-box">
            <label for="category-select">الباب:</label>
            <select id="category-select" onchange="resetGame()">
                <option value="all">جميع أبواب الجزرية (50 سؤالاً)</option>
                <option value="مقدمة ومخارج الحروف">المقدمة ومخارج الحروف</option>
                <option value="صفات الحروف">صفات الحروف</option>
                <option value="التجويد والترقيق والتفخيم">التجويد والتفخيم والترقيق</option>
                <option value="اللامات وأحكام النون والميم">النون والميم واللامات والمتماثلين</option>
                <option value="الضاد والظاء والمدود">الضاد والظاء وأحكام المد</option>
                <option value="الوقف والمقطوع والتاءات">الوقف والمقطوع والموصول والتاءات</option>
            </select>
        </div>
        <div class="depth-meter" id="depth-display">العمق: 0 م</div>
        <div class="depth-meter" id="score-display">النتيجة: 0 / 0</div>
        <div class="depth-meter" id="remaining-display">المتبقي: 50</div>
        <button id="dive-btn" onclick="openQuestion()">اغص لسؤال جديد ⬇️</button>
        <button onclick="resetGame()" style="background-color: #2ecc40;">إعادة 🔄</button>
    </div>

    <!-- الغواصة -->
    <div id="submarine-container">
        <div id="submarine">🤿🚢</div>
    </div>

    <!-- رسالة التعزيز -->
    <div id="feedback-message" class="hidden"></div>

    <!-- نافذة السؤال -->
    <div id="quiz-modal" class="hidden">
        <div class="modal-content">
            <span class="badge" id="q-badge">باب مخارج الحروف</span>
            <div class="lesson-box">
                <p id="lesson-text"></p>
            </div>
            <div id="question-text"></div>
            <div id="options"></div>
        </div>
    </div>
</div>

<script>
    // بنك الأسئلة: 50 سؤالاً غير مكرر من منظومة المقدمة الجزرية (اختيار من متعدد + صح وخطأ)
    const allQuestions = [
        // --- القسم الأول: المقدمة ومخارج الحروف (1 - 11) ---
        {
            category: "مقدمة ومخارج الحروف",
            type: "اختيار من متعدد",
            lesson: "يَقُولُ رَاجِي عَفْوِ رَبٍّ سَامِعِ ... مُحَمَّدُ بْنُ الْجَزَرِيِّ الشَّافِعِي",
            q: "من هو ناظم متن المقدمة الجزرية؟",
            options: ["الإمام الشاطبي", "محمد بن الجزري الشافعي", "سليمان الجمزوري", "حفص بن سليمان"],
            ans: 1
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "اختيار من متعدد",
            lesson: "مَخَارِجُ الحُرُوفِ سَبْعَةَ عَشَرْ ... عَلَى الَّذِي يَخْتَارُهُ مَنِ اخْتَبَرْ",
            q: "كم عدد مخارج الحروف الفرعية على القول المختار عند ابن الجزري؟",
            options: ["أربعة عشر مخرجاً", "ستة عشر مخرجاً", "سبعة عشر مخرجاً", "تسعة عشر مخرجاً"],
            ans: 2
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "صح وخطأ",
            lesson: "فَأَلِفُ الجَوْفِ وَأُخْتَاهَا وَهِي ... حُرُوفُ مَدٍّ لِلْهَوَاءِ تَنْتَهِي",
            q: "تخرج حروف المد الثلاثة (الألف والواو والياء المدية) من الجوف وتنتهي بانتهاء هواء الفم.",
            options: ["صح", "خطأ"],
            ans: 0
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "اختيار من متعدد",
            lesson: "ثُمَّ لأَقْصَى الحَلْقِ هَمْزٌ هَاءُ ... ثُمَّ لِوَسْطِهِ فَعَيْنٌ حَاءُ",
            q: "ما الحرفان اللذان يخرجان من أقصى الحلق؟",
            options: ["العين والحاء", "الغين والخاء", "الهمزة والهاء", "القاف والكاف"],
            ans: 2
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "صح وخطأ",
            lesson: "أَدْنَاهُ غَيْنٌ خَاؤُهَا وَالقَافُ ... أَقْصَى اللِّسَانِ فَوْقُ ثُمَّ الْكَافُ",
            q: "يخرج حرفا الغين والخاء من وسط الحلق.",
            options: ["صح", "خطأ"],
            ans: 1
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "اختيار من متعدد",
            lesson: "أَسْفَلُ وَالوَسْطُ فَجِيمُ الشِّينُ يَا ... وَالضَّادُ مِنْ حَافَتِهِ إِذْ وَلِيَا",
            q: "تخرج الجيم والشين والياء غير المدية من:",
            options: ["أقصى اللسان", "وسط اللسان", "طرف اللسان", "حافة اللسان"],
            ans: 1
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "اختيار من متعدد",
            lesson: "وَالضَّادُ مِنْ حَافَتِهِ إِذْ وَلِيَا ... لاضْرَاسَ مِنْ أَيْسَرَ أَوْ يُمْنَاهَا",
            q: "يخرج حرف الضاد من إحدى حافتي اللسان مع ما يليها من الأضراس، وخروجه من الجهة اليسرى:",
            options: ["ممتنع", "أيسر وأكثر استعمالاً", "أصعب وأقل استعمالاً", "لا يصح في القراءة"],
            ans: 1
        },
        {
            category: "مقدمة ومخارج الحروف",
            type: "صح وخطأ",
