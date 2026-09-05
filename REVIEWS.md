# Reviewer transcripts

Each round is an independent general-purpose subagent given only the project path, the dev-server URL and the rubric (browser walkthrough, wiki accuracy audit, coverage audit, routing audit, build/lint, six scores, PASS/FAIL verdict). Findings are fixed between rounds and a fresh reviewer is spawned.

## Round 1 — VERDICT: FAIL

Scores: Accuracy 8 · Coverage 9 · Routing 7 · Usability 8 · Visual 8 · Performance 9. Console 0 errors; build and lint clean.

Findings (all fixed before round 2):
1. Frozen Flower gated the Grand Cathedral doors instead of the Shrine of Winter obelisk to Frozen Eleum Loyce (Fextralife: Frozen Flower). → Gate moved to `winter.entrance → eleum.entrance`; cathedral doors now gated by Aava.
2. Dragon Talon placed in The Gutter's Havel room instead of Majula's pit Forgotten-Key room (Fextralife: Dragon Talon / Forgotten Key). → Moved; new landmark "Forgotten Key door (pit)".
3. Ungated two-way edge Grave of Saints bridges → Majula pit bypassed the pit gating. → Edge removed.
4. Warp mode dropped all gating (any bonfire treated as lit). → Warp steps now list the gating needed to have first reached that bonfire (shortest ungated walk from Majula) and the panel states the target must already be lit.
5. Majula pit Forgotten-Key room pickups missing (Witchtree Bellvine, Witchtree Branch, Soul Vortex, Great Lightning Spear). → Added with the door feature and gated edge.
6. Heavy Iron Key description contradicted itself. → Fixed (opens Brume Tower's door).
7. Enemy nits (Iron Warrior area, Old Knight drops, Dragon Acolyte rate wording). → Fixed.
8. Quantity nits (Dragon's Rest PDB). → Fixed.
9. COVERAGE.md stale. → Regenerated.
11. Markers not clickable at fit zoom. → Clicking an area polygon while zoomed out now flies into that area.

## Round 2 — VERDICT: FAIL

Scores: Accuracy 8 · Coverage 9 · Routing 6 · Usability 8 · Visual 8 · Performance 9. Console 0 errors; build and lint clean. All 41 bosses, all 81 bonfires, 43/44 sampled items, 12/12 drop claims and 5/5 coverage areas verified correct.

Findings (all fixed before round 3):
1. Boss routes could enter an arena through its exit (warp to the bonfire behind the boss, walk back, list "kill X" as a requirement for reaching X). → `route()`/`nearest()` now exclude edges gated on the destination's own boss; Iron Passage post-boss elevator made one-way. Verified: 0 of 41 boss routes self-require.
2. Smelter Demon was modelled as mandatory for the rest of Iron Keep. → Added the furnace-wheel bypass edge (furnace room → lever hall) per wikidot; Old Iron King now routes without Smelter.
3. "Nearest bonfire" with warping off used the Primal Bonfire's warp-to-Majula edge. → Those edges are now excluded when warping is off (Throne Floor → Upper Floor).
5. Sanctum Interior bonfire filed under Dragon's Rest instead of Dragon's Sanctum. → Moved.
6. Fume Knight description contradicted its drops. → Fixed.
7. Frigid Outskirts pickups without exact spots. → Placed per wikidot (Wilted Dusk Herb under the coffin, Blackweed Balm, Dried Root + Mirrah Hat house, 2 Human Effigies, Lacerating Knife x20, Twinkling x2).
8. Boss naming ("Twin Dragonrider", "Ruin Sentinel" as on Fextralife), pigs renamed "Enslaved Pig". → Fixed.
13/14. Drag inertia too strong; keyboard taps moved little. → Inertia halved with faster decay; each key press now nudges 60 px immediately.

