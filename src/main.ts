// The following code should help you start things off. Learn more
// in the Documentation

import Marker from "./Marker";

// ---------- ---------- ---------- ---------- ----------
// ---------- ---------- ---------- ---------- ----------

// Simple function for comparing distances
const dist_sq = (coor1: Vector, coor2: Vector) => {
  const a = coor1[0] - coor2[0];
  const b = coor1[1] - coor2[1];
  return a * a + b * b;
};

// Marking whether my base is at the top starting position or bottom
let my_base = base_zxq;
let enemy_base = base_a2c;
let my_star = star_zxq;
let enemy_star = star_a2c;

if (base_a2c.control == this_player_id) {
  my_base = base_a2c;
  enemy_base = base_zxq;
}

if (
  dist_sq(star_a2c.position, my_base.position) <
  dist_sq(star_zxq.position, my_base.position)
) {
  my_star = star_a2c;
  enemy_star = star_zxq;
}

type SpiritMarker = {
  status: "charging" | "harvesting";
  base: 0 | 1 | 2;
};

const bases = [my_base, base_nua, base_p89];
const stars = [my_star, star_nua, star_p89];

const spiritMarker = new Marker<SpiritMarker>();

if (my_spirits.length < 40) {
  my_spirits.forEach((spirit, i) => {
    spiritMarker.mark(spirit, { base: (i % 3) as SpiritMarker["base"] });

    if (spirit.energy == spirit.energy_capacity) {
      spiritMarker.mark(spirit, { status: "charging" });
    }

    if (spirit.energy == 0) {
      spiritMarker.mark(spirit, { status: "harvesting" });
    }

    const { status, base } = spiritMarker.getMark(spirit);

    const spiritsBase = bases[base];
    const spirtsStar = stars[base];

    if (status === "charging") {
      spirit.move(spiritsBase.position);
      spirit.energize(spiritsBase);
    }
    if (status === "harvesting") {
      spirit.move(spirtsStar.position);
      spirit.energize(spirit);
    }

    // Rather bad code to deal with attackers. Improve it!
    if (my_base.sight.enemies.length > 0) {
      //spirit objects are accessed by spirits['id']
      const enemy = spirits[my_base.sight.enemies[0]];
      spirit.move(enemy.position);
      spirit.energize(enemy);
    }

    // the last action (move, energize, ...) will overwrite any previous ones
    // in the same tick
  });
} else {
  // ATTACK!
  my_spirits.forEach((spirit) => {
    if (spirit.sight.friends_beamable.length > 0) {
      const friend = spirit.sight.friends_beamable[0];
      spirit.merge(spirits[friend]);
    }
    if (spirit.sight.enemies_beamable.length > 0) {
      const enemy = spirits[spirit.sight.enemies_beamable[0]];
      spirit.move(enemy.position);
      spirit.energize(enemy);
    } else {
      spirit.move(enemy_base.position);
    }
  });
}
