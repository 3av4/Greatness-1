# إعداد Firebase Spark (المجاني) — النسخة النهائية

> ⚠️ **أنت تستخدم Firebase Spark (الخطة المجانية)** — كل الخدمات المذكورة هنا متاحة مجاناً.

---

## ✅ الخدمات المتاحة مجاناً في Spark Plan

| الخدمة | الحد المجاني | هل نحتاجها؟ |
|--------|-------------|------------|
| **Firestore** | 1 GB + 50K قراءة/يوم + 20K كتابة/يوم | ✅ نعم |
| **Storage** | 5 GB + 1 GB تحميل/يوم | ✅ نعم (للصور فقط) |
| **Authentication** | 50K مستخدم/شهر (Anonymous متاح) | ✅ نعم |
| **Analytics** | مجاني غير محدود | ✅ نعم |
| **Hosting** | 1 GB + 10 GB نقل/شهر | ✅ نعم |
| **Cloud Functions** | ❌ غير متاح في Spark | ❌ لا نحتاجه |

> 💡 **Storage متاح مجاناً في Spark Plan (5 GB)** — نستخدمه لرفع صور الأعضاء والخلفيات فقط. الأغاني تُضاف عبر روابط MP3 مباشرة.

---

## 🔧 الخطوات بالتفصيل

### الخطوة 1: تفعيل Anonymous Authentication

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك: `greatness-website`
3. من القائمة اليسرى: **Build → Authentication**
4. اضغط **Get started**
5. اذهب إلى تبويب **Sign-in method**
6. ابحث عن **Anonymous** في القائمة
7. اضغط عليه → حوّل المفتاح إلى **Enabled**
8. اضغط **Save**

> ✅ **هذا ضروري** لأن الموقع يسجّل دخولاً مجهولاً تلقائياً.

---

### الخطوة 2: تفعيل Firestore Database

1. من القائمة اليسرى: **Build → Firestore Database**
2. اضغط **Create database**
3. اختر **Start in production mode**
4. اختر المنطقة الأقرب لك (مثلاً `eur3` أو `europe-west`)
5. اضغط **Enable**

#### ضع قواعد الأمان:

1. اذهب إلى تبويب **Rules**
2. امسح ما هو موجود وألصق:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /chat/{id} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    match /songs/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. اضغط **Publish**

---

### الخطوة 3: تفعيل Storage (للصور فقط)

> **Storage متاح مجاناً في Spark Plan (5 GB)** — نستخدمه لرفع صور الأعضاء والخلفيات فقط.

1. من القائمة اليسرى: **Build → Storage**
2. اضغط **Get started**
3. اختر **Start in production mode**
4. اختر نفس المنطقة التي اخترتها لـ Firestore
5. اضغط **Done**

#### ضع قواعد Storage:

1. اذهب إلى تبويب **Rules**
2. امسح ما هو موجود وألصق:

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /members/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. اضغط **Publish**

---

### الخطوة 4: إضافة الدومين المصرح به

1. اذهب إلى **Authentication → Settings**
2. انزل إلى **Authorized domains**
3. أضف دومين موقعك النهائي:
   - `localhost` (موجود تلقائياً)
   - `yourdomain.com`
   - `www.yourdomain.com`

---

### الخطوة 5: مسح البيانات القديمة

#### أ) مسح localStorage من المتصفح:
```
F12 → Application → Local Storage → موقعك → 🚫 Clear all
```

#### ب) حذف من Firestore (إذا وجدت بيانات قديمة):
```
Firestore Database → Data → collection "members" → ⋮ → Delete collection
Firestore Database → Data → collection "songs" → ⋮ → Delete collection
Firestore Database → Data → collection "chat" → ⋮ → Delete collection
```

#### ج) حذف من Storage (إذا وجدت ملفات قديمة):
```
Storage → Files → احذف الملفات
```

---

### الخطوة 6: افتح الموقع

1. افتح الموقع في المتصفح
2. سيتم زرع البيانات الجديدة تلقائياً
3. جرب تسجيل الدخول
4. جرب إضافة أغنية عبر رابط MP3
5. جرب إرسال رسالة في الشات

---

## 🎵 كيفية إضافة أغنية

1. ادخل إلى **catbox.moe**
2. ارفع ملف MP3
3. انسخ الرابط المباشر (مثال: `https://files.catbox.moe/xxxxxx.mp3`)
4. في الموقع: Music Hub → "أضف أغنية"
5. ألصق الرابط

---

## 🔒 الحماية المطبقة

### في الموقع:
- ✅ منع النقر باليمين
- ✅ منع F12
- ✅ منع Ctrl+Shift+I/J/C
- ✅ منع Ctrl+U
- ✅ منع تحديد النص
- ✅ منع السحب
- ✅ رسالة تحذير في Console

### في Firebase:
- ✅ Anonymous Auth
- ✅ Firestore Rules
- ✅ Storage Rules

---

## 📱 تثبيت الموقع كـ PWA

### Android (Chrome):
1. افتح الموقع
2. القائمة ⋮ → "تثبيت التطبيق"

### iPhone (Safari):
1. افتح الموقع
2. زر المشاركة ⬆️ → "إضافة إلى الشاشة الرئيسية"

### الكمبيوتر (Chrome/Edge):
1. افتح الموقع
2. انظر لأيقونة ➕ في شريط العنوان → Install

---

## 🔑 كلمات المرور

| العضو | كلمة المرور |
|-------|------------|
| عبد الأول | `Abd10` |
| حسن | `7sn01` |
| عبد الثاني | `Abd02` |
| تونة | `Tona9` |
| خرية | `Ni69o` |
| حمدية | `7md96` |
| لينصو | `Lins11` |
| أبو عباس ديباج | `Abojm` |

---

## ✅ قائمة التحقق النهائية

- [ ] Anonymous Authentication مفعل
- [ ] Firestore Database مفعل
- [ ] Storage مفعل (للصور)
- [ ] Firestore Rules منشورة
- [ ] Storage Rules منشورة
- [ ] الدومين مضاف في Authorized domains
- [ ] localStorage مسح من المتصفح
- [ ] الموقع يعمل ويُعيد الزرع التلقائي
- [ ] تسجيل الدخول يعمل
- [ ] إضافة أغنية عبر رابط MP3 يعمل
- [ ] الشات يعمل
- [ ] PWA يمكن تثبيته
- [ ] Visualizer يعمل بدون تشويش
- [ ] رفع صور الأعضاء يعمل
- [ ] رفع خلفيات البطاقات يعمل

---

## 🛠️ استكشاف الأخطاء

### "Permission denied"
- Anonymous Auth غير مفعل ← فعّله
- Rules غير صحيحة ← انسخها بالضبط من أعلاه

### الأغاني لا تُضاف
- تأكد من أن الرابط ينتهي بـ `.mp3`
- جرب رابط من catbox.moe

### الشات لا يعمل
- Firestore Rules تمنع الكتابة ← تأكد من القواعد
- Anonymous Auth غير مفعل

---

## 📞 إذا واجهت مشكلة

أرسل لي:
1. لقطة شاشة لـ Console (F12 → Console)
2. ما الخطوة التي توقفت عندها
3. هل تستخدم localhost أم دومين عام؟
