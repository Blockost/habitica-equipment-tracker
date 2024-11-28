import { HabiticaGear } from "./habitica.model";

const IMAGES_REPO_URL = `https://habitica-assets.s3.amazonaws.com/mobileApp/images`;
const REGEXP = /Enchanted Armoire: (.*) \(Item (.*)\)/i;
const REGEXP_ARMOIRE = /Enchanted Armoire: /i;

export interface HabiticaGearVM {
  key: string;
  icon: string;
  name: string;
  description: string;
  set: string;
  setIndex: string;
  setFullName: string;
  type: string;
  owned: boolean;
}

export function mapToVM(gear: HabiticaGear): HabiticaGearVM {
  const [setName, setIndex] = mapGearSet(gear);

  return {
    key: gear.key,
    icon: `${IMAGES_REPO_URL}/shop_${gear.key}.png`,
    name: gear.text,
    description: mapDescription(gear),
    set: setName,
    setIndex: setIndex,
    setFullName: mapSetFullName(setName, setIndex),
    // TODO 2024-11-27 Blockost Use title case here
    type: gear.type,
    owned: false,
  };
}

function mapSetFullName(setName: string, setIndex: string): string {
  if (setIndex?.trim().length > 0) {
    return `${setName} (${setIndex})`;
  }

  return setName;
}

function mapDescription(gear: HabiticaGear): string {
  if (gear == null || gear.notes == null || gear.notes.length < 1) {
    return "-";
  }

  const match = gear.notes.match(REGEXP_ARMOIRE);
  if (match == null) {
    return gear.notes.trim();
  }

  return gear.notes.slice(0, match.index).trim();
}

function mapGearSet(gear: HabiticaGear): [string, string] {
  if (gear == null || gear.set == null || gear.set.length < 1) {
    return ["-", ""];
  }

  if (gear.set.startsWith("armoire-")) {
    return ["-", ""];
  }

  const match = gear.notes.match(REGEXP);
  if (match == null) {
    return ["-", ""];
  }

  const setName = match[1];
  const setIndex = match[2];
  return [setName.trim(), setIndex.trim()];
}
