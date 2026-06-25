export interface Member {
  id: string;
  handle: string;
  name: string;
  age?: number;
  country: string;
  rank: string;
  motto: string;
  instagram: string;
  imageUrl: string;
  bannerUrl?: string;
  borderColor?: string;
  cardColor?: string;
  nameColor?: string;
  frameStyle?: string;
  password: string;
  isBanned?: boolean;
  emblems?: string[];
}

export const SEED_MEMBERS: Member[] = [
  {
    id: "m_abd1", handle: "عبد الأول", name: "عبد النور", age: 20, country: "الجزائر", rank: "admin",
    motto: "روح وقلب العظمة", instagram: "_8av9", imageUrl: "https://files.catbox.moe/usuuhz.png",
    borderColor: "#FF0040", cardColor: "#2a0608", nameColor: "#FFD700", frameStyle: "neon", password: "Abd10", emblems: ["👑", "⚡"],
  },
  {
    id: "m_hassan", handle: "حسن", name: "حسن", age: 17, country: "لبنان", rank: "owner",
    motto: "مؤسس العظمة", instagram: "xflay_1", imageUrl: "https://files.catbox.moe/3sf0nu.png",
    borderColor: "#FFD700", cardColor: "#2a1f06", nameColor: "#FFD700", frameStyle: "gold", password: "7sn01", emblems: ["❄️", "#1"],
  },
  {
    id: "m_hamdi", handle: "حمدية", name: "تاج دين", age: 19, country: "الجزائر", rank: "member",
    motto: "كذاب العظمة", instagram: "mezaiane.esp", imageUrl: "https://files.catbox.moe/wp5bnm.png",
    borderColor: "#8A2BE2", cardColor: "#150825", nameColor: "#8A2BE2", frameStyle: "corner", password: "7md96",
  },
  {
    id: "m_touna", handle: "تونة", name: "يحيى", age: 16, country: "الجزائر", rank: "member",
    motto: "ملحد العظمة", instagram: "da_mn14", imageUrl: "https://files.catbox.moe/ny4h42.png",
    borderColor: "#00FFFF", cardColor: "#062024", nameColor: "#00FFFF", frameStyle: "double", password: "Tona9",
  },
  {
    id: "m_abd2", handle: "عبد الثاني", name: "عبد خالق", age: 17, country: "الجزائر", rank: "member",
    motto: "عظيم عظمة", instagram: "x_abdoo_19", imageUrl: "https://files.catbox.moe/5hqt0u.png",
    borderColor: "#FF4500", cardColor: "#2a0f06", nameColor: "#FF4500", frameStyle: "segmented", password: "Abd02",
  },
  {
    id: "m_khrya", handle: "خرية", name: "ريان", country: "العراق / المغرب", rank: "member",
    motto: "رابر عظمة", instagram: "oldneiro", imageUrl: "https://files.catbox.moe/azxd7m.png",
    borderColor: "#32CD32", cardColor: "#0a2a10", nameColor: "#32CD32", frameStyle: "neon", password: "Ni69o",
  },
  {
    id: "m_debbag", handle: "أبو عباس ديباج", name: "سيد محمد", age: 21, country: "العراق", rank: "member",
    motto: "مصمم العظمة", instagram: "82bw2", imageUrl: "https://files.catbox.moe/eb7q9c.png",
    borderColor: "#FF1493", cardColor: "#2a0620", nameColor: "#FF1493", frameStyle: "gold", password: "Abojm",
  },
  {
    id: "m_linso", handle: "لينصو", name: "الياس", age: 16, country: "فلسطين / الأردن", rank: "member",
    motto: "مسلم عظمة", instagram: "same.linso", imageUrl: "https://files.catbox.moe/i2cc8i.png",
    borderColor: "#1E90FF", cardColor: "#06152a", nameColor: "#1E90FF", frameStyle: "corner", password: "Lins11",
  },
];

export const RANK_LABELS: Record<string, string> = {
  admin: "SUPER ADMIN", owner: "OWNER", member: "MEMBER",
};

export const RANK_GRADIENTS: Record<string, string> = {
  admin: "linear-gradient(135deg,#B1121A,#FF0040,#8B0000)",
  owner: "linear-gradient(135deg,#FFD700,#FFA500,#FF8C00)",
  member: "linear-gradient(135deg,#8A2BE2,#6A5ACD,#483D8B)",
};

export const SEED_SONGS = [
  {
    id: "s_1", title: "عظمة الليل", artist: "عبد الأول",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    uploadedBy: "m_abd1", likes: ["m_hassan", "m_abd2"], dislikes: [], views: 12, createdAt: Date.now() - 86400000,
  },
  {
    id: "s_2", title: "قمة الجبل", artist: "حسن",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    uploadedBy: "m_hassan", likes: ["m_abd1", "m_touna", "m_linso"], dislikes: [], views: 8, createdAt: Date.now() - 36000000,
  },
];

export const SEED_MESSAGES: any[] = [];
