// Emoji-Kürzel wie :tools: werden beim Speichern zu echten Emojis, Server-Emojis zu <:name:id>.
// Discord zeigt Kürzel in Nachrichten von Bots nicht an, deshalb muss das vor dem Posten passieren.

export interface CustomEmoji {
  id: string;
  name: string;
  animated: boolean;
  guild_name: string;
}

export const SHORTCODES: Record<string, string> = {
  tools: "🛠️", hammer_and_wrench: "🛠️", hammer: "🔨", wrench: "🔧", gear: "⚙️", nut_and_bolt: "🔩",
  construction: "🚧", bandage: "🩹", adhesive_bandage: "🩹", package: "📦", wing: "🪽", fire: "🔥",
  rocket: "🚀", tada: "🎉", confetti_ball: "🎊", sparkles: "✨", boom: "💥", zap: "⚡", star: "⭐",
  star2: "🌟", "100": "💯", trophy: "🏆", crown: "👑", gift: "🎁", shield: "🛡️", crossed_swords: "⚔️",
  dart: "🎯", bomb: "💣", key: "🔑", lock: "🔒", unlock: "🔓", mag: "🔍", bulb: "💡", link: "🔗",
  loudspeaker: "📢", mega: "📣", bell: "🔔", speech_balloon: "💬", envelope: "✉️", memo: "📝",
  book: "📖", scroll: "📜", calendar: "📅", alarm_clock: "⏰", hourglass: "⏳", stopwatch: "⏱️",
  new: "🆕", up: "🆙", free: "🆓", ok: "🆗", information_source: "ℹ️", warning: "⚠️", no_entry: "⛔",
  stop_sign: "🛑", exclamation: "❗", question: "❓", bangbang: "‼️", white_check_mark: "✅",
  heavy_check_mark: "✔️", x: "❌", arrow_right: "➡️", arrow_up: "⬆️", point_right: "👉",
  point_down: "👇", point_up: "☝️", eyes: "👀", pray: "🙏", wave: "👋", clap: "👏", raised_hands: "🙌",
  muscle: "💪", thumbsup: "👍", "+1": "👍", thumbsdown: "👎", ok_hand: "👌", heart: "❤️",
  sparkling_heart: "💖", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤",
  green_circle: "🟢", red_circle: "🔴", yellow_circle: "🟡", blue_circle: "🔵", orange_circle: "🟠",
  white_circle: "⚪", black_circle: "⚫", small_blue_diamond: "🔹", video_camera: "📹",
  movie_camera: "🎥", clapper: "🎬", tv: "📺", camera: "📷", camera_with_flash: "📸", art: "🎨",
  video_game: "🎮", joystick: "🕹️", microphone: "🎤", headphones: "🎧", musical_note: "🎵",
  computer: "💻", desktop: "🖥️", iphone: "📱", cloud: "☁️", snowflake: "❄️", sunny: "☀️", moon: "🌙",
  rainbow: "🌈", mountain: "⛰️", snow_capped_mountain: "🏔️", evergreen_tree: "🌲", earth_africa: "🌍",
  globe_with_meridians: "🌐", flag_ch: "🇨🇭", chart_with_upwards_trend: "📈", moneybag: "💰",
  shopping_cart: "🛒", handshake: "🤝", smile: "😄", grin: "😁", joy: "😂", wink: "😉",
  sweat_smile: "😅", heart_eyes: "😍", sunglasses: "😎", thinking: "🤔", sob: "😭", rage: "😡",
  partying_face: "🥳", skull: "💀", ghost: "👻", robot: "🤖", alien: "👽", unicorn: "🦄", dragon: "🐉",
  cat: "🐱", dog: "🐶", sparkler: "🎇", tophat: "🎩", test_tube: "🧪", microscope: "🔬",
};

const customTag = (e: CustomEmoji) => `<${e.animated ? "a" : ""}:${e.name}:${e.id}>`;

// Code-Blöcke, Inline-Code und fertige Server-Emojis bleiben unangetastet.
const SKIP = /(```[\s\S]*?```|`[^`\n]*`|<a?:\w+:\d+>)/;
const SHORT = /:([A-Za-z0-9_+-]{2,32}):/g;

export function convertShortcodes(text: string, custom: CustomEmoji[]): string {
  if (!text.includes(":")) return text;
  // Aracle-Emojis zuerst, falls ein Name auf mehreren Servern vorkommt.
  const ordered = [...custom].sort(
    (a, b) => Number(/aracle/i.test(b.guild_name)) - Number(/aracle/i.test(a.guild_name)),
  );
  const exact = new Map<string, CustomEmoji>();
  const loose = new Map<string, CustomEmoji>();
  for (const e of ordered) {
    if (!exact.has(e.name)) exact.set(e.name, e);
    if (!loose.has(e.name.toLowerCase())) loose.set(e.name.toLowerCase(), e);
  }

  return text
    .split(SKIP)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part.replace(SHORT, (whole, name: string) => {
        const hit = exact.get(name);
        if (hit) return customTag(hit);
        const std = SHORTCODES[name.toLowerCase()];
        if (std) return std;
        const near = loose.get(name.toLowerCase());
        return near ? customTag(near) : whole;
      });
    })
    .join("");
}

export const customEmojiTag = customTag;
export const emojiUrl = (id: string, animated: boolean, size = 48) =>
  `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "webp"}?size=${size}&quality=lossless`;
