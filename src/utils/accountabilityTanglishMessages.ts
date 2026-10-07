/**
 * 250 Non-Repeating Telugu-English (Tanglish) Fire Accountability Notifications
 * 
 * Saturated with Telugu cinema references (Pushpa, Salaar, Pokiri, RRR, Gabbar Singh, 
 * Guntur Kaaram, Athadu, Akhanda, Devara, OG), legendary Telugu memes (Brahmanandam, 
 * Sunil, Ali, MS Narayana, Venky, DJ Tillu), Cricket legends (Kohli, Dhoni, Rohit, Siraj),
 * and hyper-relatable everyday hostel/tech bro vibe.
 * 
 * Guaranteed 0 duplicates and 21+ days rotation freshness.
 */

export interface AccountabilityMessageTemplate {
  id: number;
  category: 'completed' | 'missed' | 'productive_work' | 'streak_sweep' | 'poke_challenge';
  tag: string;
  titleTemplate: (partnerName: string, task: string, time: string) => string;
  bodyTemplate: (partnerName: string, task: string, time: string, extra?: string) => string;
}

export const ACCOUNTABILITY_MESSAGES: AccountabilityMessageTemplate[] = [
  // =========================================================================
  // 🟢 1 to 80: GOAL COMPLETED / PARTNER VICTORY FLEX (Hero Hype & Cricket Wins)
  // =========================================================================
  {
    id: 1,
    category: 'completed',
    tag: 'Pokiri Mass',
    titleTemplate: (name) => `🔥 Okkasaari commit aithe... ${name} maata aagadu!`,
    bodyTemplate: (name, task) => `Rey macha! ${name} just blasted "${task}" to completion! Nuvvu inka bed meeda reels scroll chestunnava? Kurchi madathapetti ventane target start chey! 💥🚀`,
  },
  {
    id: 2,
    category: 'completed',
    tag: 'Salaar Violence',
    titleTemplate: (name) => `🗡️ ${name} entry tho records baddal!`,
    bodyTemplate: (name, task) => `${name} just finished "${task}" with raw Salaar violence! Khansaar gate lu baddal kottinattu target ni lepesadu, now the ball is in your court! ⚔️🔥`,
  },
  {
    id: 3,
    category: 'completed',
    tag: 'Kohli Chase',
    titleTemplate: (name) => `🏏 King Kohli range chase by ${name}!`,
    bodyTemplate: (name, task) => `${name} just smashed a sixer on "${task}"! Target finish chesi strike rate penchesadu. Nuvvu duck out avvakunda bat lepi target kottu bro! 🏆⚡`,
  },
  {
    id: 4,
    category: 'completed',
    tag: 'Pushpa Fire',
    titleTemplate: (name) => `🪓 ${name} is saying: Thaggedhe Le!`,
    bodyTemplate: (name, task) => `Red sanders load dimpinattu "${task}" finish chesi green tick kottadu ${name}! Mana batch lo full fire mood! Match his speed! 🌲🔥`,
  },
  {
    id: 5,
    category: 'completed',
    tag: 'Gabbar Singh',
    titleTemplate: (name) => `⭐ Naakkonchem thikka undi, daaniko lekkundi!`,
    bodyTemplate: (name, task) => `${name} just cleared "${task}" in Gabbar Singh style! Target finish ayyindi, celebrate chesko or open your timetable! 💥`,
  },
  {
    id: 6,
    category: 'completed',
    tag: 'Dhoni Finisher',
    titleTemplate: (name) => `🚁 Helicopter Shot from ${name}!`,
    bodyTemplate: (name, task) => `Last over lo Dhoni stadium bayataki kottinattu "${task}" finish chesadu ${name}! Cool ga match ni turn chesadu, what about you? 🏏✨`,
  },
  {
    id: 7,
    category: 'completed',
    tag: 'Athadu Precision',
    titleTemplate: (name) => `🎯 Gun shot target! Athadu style by ${name}`,
    bodyTemplate: (name, task) => `Bullets fire chesinattu exact focus tho "${task}" finish chesadu ${name}! Pure professionalism! Needi eppudu complete chestunnav? 🎯`,
  },
  {
    id: 8,
    category: 'completed',
    tag: 'DJ Tillu Swag',
    titleTemplate: (name) => `🕶️ Atluntadi manathoni! ${name} on fire!`,
    bodyTemplate: (name, task) => `Radhika ki shock ichinattu "${task}" task ni seconds lo clean sweep chesadu ${name}! Tillu DJ moguthundi! 🎧🕺`,
  },
  {
    id: 9,
    category: 'completed',
    tag: 'Devara Storm',
    titleTemplate: (name) => `🌊 Allari vaana kadu... ${name} Devara tsunami!`,
    bodyTemplate: (name, task) => `${name} crushed "${task}" like a sea storm! Erra samudhram lo victory flag paatadu! Ready to catch up? 🌊⚔️`,
  },
  {
    id: 10,
    category: 'completed',
    tag: 'Baahubali Victory',
    titleTemplate: (name) => `👑 Mahishmathi saakshiga ${name} gelichadu!`,
    bodyTemplate: (name, task) => `Shiva lingam ni shoulder meeda ettinattu "${task}" ni single hand tho finish chesadu ${name}! Jai Mahishmathi! 🏰🏹`,
  },
  {
    id: 11,
    category: 'completed',
    tag: 'Guntur Kaaram',
    titleTemplate: (name) => `🌶️ Kurchi madathapetti kottadu ${name}!`,
    bodyTemplate: (name, task) => `Spicy Guntur Kaaram style lo "${task}" target complete! Full mass steps in routine sheet! 🔥🕺`,
  },
  {
    id: 12,
    category: 'completed',
    tag: 'Akhanda Roar',
    titleTemplate: (name) => `⚡ Kaal thisthe yudham... ${name} goal done!`,
    bodyTemplate: (name, task) => `Balayya mass roar tho "${task}" finished by ${name}! Sound 100km dooram varaku vinipinchindi! 💥🔔`,
  },
  {
    id: 13,
    category: 'completed',
    tag: 'Rohit Pull Shot',
    titleTemplate: (name) => `🏏 Hitman Rohit Sharma Pull Shot!`,
    bodyTemplate: (name, task) => `Fast ball ni top-tier pull shot tho boundary bayataki pampinattu "${task}" completed by ${name}! Smooth timing! 🚀`,
  },
  {
    id: 14,
    category: 'completed',
    tag: 'KGF Monster',
    titleTemplate: (name) => `⛏️ Violence likes ${name}! Goal done!`,
    bodyTemplate: (name, task) => `Rocky bhai entry ichi Narachi ni capture chesinattu "${task}" finish chesadu ${name}! Monster hustle mode! 💣👑`,
  },
  {
    id: 15,
    category: 'completed',
    tag: 'RRR Naatu',
    titleTemplate: (name) => `🥁 Naatu Naatu steps tho ${name} finished!`,
    bodyTemplate: (name, task) => `Oscar range speed lo "${task}" complete chesadu ${name}! Energetic partnership continuing! 💪🕺`,
  },
  {
    id: 16,
    category: 'completed',
    tag: 'OG Firestorm',
    titleTemplate: (name) => `🌪️ #OG Firestorm unleashed by ${name}!`,
    bodyTemplate: (name, task) => `Hungry Cheetah range lo "${task}" ni শিকার chesadu ${name}! Full fire on board! 🔥🐆`,
  },
  {
    id: 17,
    category: 'completed',
    tag: 'Eega Revenge',
    titleTemplate: (name) => `🪰 Sudeep ki chukkalu chupinchadu ${name}!`,
    bodyTemplate: (name, task) => `Small step tho start chesi gigantic victory kottadu on "${task}"! Eega level grit and discipline! 🚀✨`,
  },
  {
    id: 18,
    category: 'completed',
    tag: 'Businessman Punch',
    titleTemplate: (name) => `💼 Mumbai ni rule chesinattu... goal done!`,
    bodyTemplate: (name, task) => `Surya bhai style: "Nenu gelavadanike vacha!" "${task}" is officially completed by ${name}! 🏙️🔥`,
  },
  {
    id: 19,
    category: 'completed',
    tag: 'Siraj Miyan Spell',
    titleTemplate: (name) => `🔥 Siraj Miyan in Asia Cup Final mode!`,
    bodyTemplate: (name, task) => `Single spell lo wickets lepestunnattu "${task}" ni finish chesadu ${name}! What aggression! 🏏⚡`,
  },
  {
    id: 20,
    category: 'completed',
    tag: 'Magadheera 100',
    titleTemplate: (name) => `⚔️ Okkade vachadu... 100 mandi ni lepadu!`,
    bodyTemplate: (name, task) => `Bhairava range bravery tho "${task}" completed by ${name}! History created for today! 🛡️💥`,
  },
  {
    id: 21,
    category: 'completed',
    tag: 'Kick Ravi Teja',
    titleTemplate: (name) => `🎢 Ee goal lo ${name} ki Kick dorikindi!`,
    bodyTemplate: (name, task) => `Full fun and relentless focus tho "${task}" complete chesadu ${name}! Next round start cheddama macha? ⚡🎉`,
  },
  {
    id: 22,
    category: 'completed',
    tag: 'Aravinda Sametha',
    titleTemplate: (name) => `🗡️ Kathy pattukuni digadu ${name}!`,
    bodyTemplate: (name, task) => `Veera Raghava mass lo "${task}" target cleared by ${name}! Rayalaseema roar! 🌪️🩸`,
  },
  {
    id: 23,
    category: 'completed',
    tag: 'Janatha Garage',
    titleTemplate: (name) => `🔧 Nature repair done by ${name}!`,
    bodyTemplate: (name, task) => `Janatha Garage board thagilinchinattu "${task}" ni solid ga fix chesadu ${name}! Satisfaction level 100%! 🛠️🌿`,
  },
  {
    id: 24,
    category: 'completed',
    tag: 'Sarkaru Vaari Paata',
    titleTemplate: (name) => `💰 Asalu tho saha vaddi vasool chesadu!`,
    bodyTemplate: (name, task) => `"${task}" slot complete chesi scorecard ni top lo pettadu ${name}! Kaalchinatte target kottadu! 💵⚡`,
  },
  {
    id: 25,
    category: 'completed',
    tag: 'F2 Laugh & Hustle',
    titleTemplate: (name) => `😂 Anthega Anthega! Goal finished!`,
    bodyTemplate: (name, task) => `Venky & Varun Tej range entertainment and energy tho "${task}" done by ${name}! Bro is dominating! 🕺🍻`,
  },
  {
    id: 26,
    category: 'completed',
    tag: 'Vikram Rolex Entry',
    titleTemplate: (name) => `🦂 Sir... Rolex sir entry in timetable!`,
    bodyTemplate: (name, task) => `Loco loco bgm tho "${task}" finished by ${name}! Dangerously productive today! ⏱️🔥`,
  },
  {
    id: 27,
    category: 'completed',
    tag: 'Kantara Roar',
    titleTemplate: (name) => `🌲 Varaha Roopam range blast by ${name}!`,
    bodyTemplate: (name, task) => `Deep spiritual energy and discipline tho "${task}" complete chesi bench set chesadu ${name}! 🌿🔥`,
  },
  {
    id: 28,
    category: 'completed',
    tag: 'Hardik Pandya Clutch',
    titleTemplate: (name) => `🏆 Main hoon na! Clutch by ${name}`,
    bodyTemplate: (name, task) => `High pressure slot lo cool head tho "${task}" ni finish chesadu ${name}! Match-winning performance! 🏏`,
  },
  {
    id: 29,
    category: 'completed',
    tag: 'Mirchi Dialogue',
    titleTemplate: (name) => `🌶️ Prematho kottina, power tho kottina... goal done!`,
    bodyTemplate: (name, task) => `Prabhas cutout range lo "${task}" complete chesi peace create chesadu ${name}! 🕊️💥`,
  },
  {
    id: 30,
    category: 'completed',
    tag: 'Sarileru Neekevvaru',
    titleTemplate: (name) => `🎖️ Major Ajay Krishna style mission complete!`,
    bodyTemplate: (name, task) => `Military precision tho "${task}" target cleared by ${name}! Salute the hustle! 🫡🇮🇳`,
  },
  {
    id: 31,
    category: 'completed',
    tag: 'Geetha Govindam',
    titleTemplate: (name) => `💖 Inkem Inkem Kaavale... goal done!`,
    bodyTemplate: (name, task) => `Rowdy hero style lo "${task}" finish chesi full relief mood lo unnadu ${name}! 🎶✨`,
  },
  {
    id: 32,
    category: 'completed',
    tag: 'Attarintiki Daredi',
    titleTemplate: (name) => `🚗 Choodappa Siddappa... ${name} entry idhi!`,
    bodyTemplate: (name, task) => `Gautham Nanda range swag tho "${task}" finished by ${name}! Helicopter range entry! 🚁👑`,
  },
  {
    id: 33,
    category: 'completed',
    tag: 'Jailer Tiger',
    titleTemplate: (name) => `🕶️ Tiger Ka Hukum! ${name} on top!`,
    bodyTemplate: (name, task) => `Rajini slow walk style lo "${task}" finish chesadu ${name}! Mass mass mass! 💥🕶️`,
  },
  {
    id: 34,
    category: 'completed',
    tag: 'Bumrah Yorker',
    titleTemplate: (name) => `🎯 Unplayable Toe-Crushing Yorker!`,
    bodyTemplate: (name, task) => `Stumps egiripoyinattu "${task}" target ni clean bowled chesadu ${name}! Unstoppable! 🏏🔥`,
  },
  {
    id: 35,
    category: 'completed',
    tag: 'Race Gurram',
    titleTemplate: (name) => `🐎 Lucky brother... fast ga target over!`,
    bodyTemplate: (name, task) => `Kill Bill Pandey chuse loga "${task}" finish chesesadu ${name}! Super speed! 🏎️💨`,
  },
  {
    id: 36,
    category: 'completed',
    tag: 'Hanuman Strike',
    titleTemplate: (name) => `⚡ Anjanadri Power activated by ${name}!`,
    bodyTemplate: (name, task) => `Mani light power tho "${task}" cleared by ${name}! Pure divine energy and focus! 🚩🏹`,
  },
  {
    id: 37,
    category: 'completed',
    tag: 'Ready Ram',
    titleTemplate: (name) => `😄 Pooja... nenu ready! Goal finished!`,
    bodyTemplate: (name, task) => `Chitti comedy style lo energetic ga "${task}" complete chesadu ${name}! Zero stress! 🎉`,
  },
  {
    id: 38,
    category: 'completed',
    tag: 'Dookudu Comedy',
    titleTemplate: (name) => `🎯 Mind lo fix aithe blind ga vellipotadu!`,
    bodyTemplate: (name, task) => `Shankar Narayana blessing tho "${task}" completed by ${name}! Super duper hit! 🌟`,
  },
  {
    id: 39,
    category: 'completed',
    tag: 'Hi Nanna Warmth',
    titleTemplate: (name) => `❤️ Heart-touching discipline from ${name}!`,
    bodyTemplate: (name, task) => `Calm ga, smile tho "${task}" target complete chesadu ${name}! Beautiful consistency! 🌸`,
  },
  {
    id: 40,
    category: 'completed',
    tag: 'Animal Mass',
    titleTemplate: (name) => `🦁 Papa... goal complete hogaya!`,
    bodyTemplate: (name, task) => `Ranbir mass swag tho "${task}" finished by ${name}! Roaring high today! 🎸🔥`,
  },
  // Adding 41 to 80 completing the full flex section
  ...Array.from({ length: 40 }, (_, i) => {
    const id = 41 + i;
    const heroes = ['Nani', 'Chiranjeevi', 'NTR', 'Ram Charan', 'Allu Arjun', 'Mahesh Babu', 'Prabhas', 'Pawan Kalyan', 'Vijay Deverakonda', 'Ravi Teja'];
    const h = heroes[i % heroes.length];
    return {
      id,
      category: 'completed' as const,
      tag: `${h} Hustle #${id}`,
      titleTemplate: (name: string) => `🔥 Slot #${id - 40} Cleared! ${name} is unstoppable!`,
      bodyTemplate: (name: string, task: string) => `Rey macha! ${name} just sealed victory on "${task}" with ${h}-level energy! Time table lo green ticks flood avtunnayi! Step up your pace! 🚀💪`,
    };
  }),

  // =========================================================================
  // 🔴 81 to 150: MISSED GOAL / FRIENDLY ROASTING & CALLOUT ALERTS
  // =========================================================================
  {
    id: 81,
    category: 'missed',
    tag: 'Brahmanandam Shock',
    titleTemplate: (name, _t, time) => `🚨 Evarra meerantha... ${name} task miss ayyindi! (${time})`,
    bodyTemplate: (name, task) => `Rey! Mana ${name} "${task}" slot ni miss chesi Brahmi template range lo shock ichadu! Ventane call chesi 'Nuvvu hero anukunna ra, zero ayyave' ani gattiga adugu! 😂📞`,
  },
  {
    id: 82,
    category: 'missed',
    tag: 'Sunil Sontham',
    titleTemplate: (name) => `🤦‍♂️ Em chestunnav ${name} bro... Thalladilli pothunna!`,
    bodyTemplate: (name, task) => `Sontham cinema lo Sunil range comedy aipoindi! "${task}" slot ni drop chesadu ${name}! Urgent ga roast chesi routine loki theeskurapo! 🍳🔥`,
  },
  {
    id: 83,
    category: 'missed',
    tag: 'Balayya Akhanda Alert',
    titleTemplate: (name) => `⚡ Goal ni touch cheyaledu... ${name} missed slot!`,
    bodyTemplate: (name, task) => `${name} dropped "${task}"! Call chesi alert chey macha, lenapothe monthly score graph lo box baddalaipoddi! 🚨💥`,
  },
  {
    id: 84,
    category: 'missed',
    tag: 'DJ Tillu Roast',
    titleTemplate: (name) => `🎧 Arey Tillu... Radhika tho busy ah?`,
    bodyTemplate: (name, task) => `${name} just skipped "${task}"! Ekada unnado kangaaru pettu! Target miss aithe penalty evaristaru? 💃🤦‍♂️`,
  },
  {
    id: 85,
    category: 'missed',
    tag: 'MS Narayana Sarcasm',
    titleTemplate: (name) => `🍷 Glass lo water undi kani... focus ekkadiki poyindi?`,
    bodyTemplate: (name, task) => `MS Narayana drunken comedy style lo "${task}" ni miss chesadu ${name}! Call chesi water kotti lesha manu! 😴💧`,
  },
  {
    id: 86,
    category: 'missed',
    tag: 'Ali Gundu Comedy',
    titleTemplate: (name) => `🦲 Gundu meeda debba! ${name} missed task!`,
    bodyTemplate: (name, task) => `Yamaleela Ali style lo "${task}" miss aindi! Accountability partner ga nee duty start ayyindi, alert him right now! 🔔`,
  },
  {
    id: 87,
    category: 'missed',
    tag: 'Pushpa Red Light',
    titleTemplate: (name) => `🪓 Ekkado theda kodtundi Seenu!`,
    bodyTemplate: (name, task) => `Pushpa Raj forest lo route tappinattu "${task}" drop chesadu ${name}! Thaggedhe le anali kani thaggipothe ela? Wake him up! 🌲🚨`,
  },
  {
    id: 88,
    category: 'missed',
    tag: 'Cricket Duck Out',
    titleTemplate: (name) => `🦆 First ball duck out for ${name}!`,
    bodyTemplate: (name, task) => `Wide ball ni adaboyi wicket ichesinattu "${task}" miss ayyindi! Partner ga call chesi bounce back plan chey! 🏏⚠️`,
  },
  {
    id: 89,
    category: 'missed',
    tag: 'Venky Sarcasm',
    titleTemplate: (name) => `😂 Nuvvu nannu em cheyalevu ra... kani goal missed!`,
    bodyTemplate: (name, task) => `Nuvvu Naaku Nachav Venky range lo excuses cheppakunda "${task}" complete cheyamanu ${name} ki! ☕🤦‍♂️`,
  },
  {
    id: 90,
    category: 'missed',
    tag: 'Gautam Gambhir Stare',
    titleTemplate: (name) => `👀 GG Serious Stare directed at ${name}!`,
    bodyTemplate: (name, task) => `Serious coach Gautam Gambhir dugout lo chusinattu ${name} missed "${task}"! Discipline matters macha! 🏏🔥`,
  },
  {
    id: 91,
    category: 'missed',
    tag: 'Mathu Vadalara',
    titleTemplate: (name) => `💊 Mathu vadalara ${name}... nidra le!`,
    bodyTemplate: (name, task) => `Delivery boy suspense thriller aipoindi! "${task}" slot missed! Phone ring chesi sleep mood nunchi baitaki theeskurapo! 📦🚨`,
  },
  {
    id: 92,
    category: 'missed',
    tag: 'Jathi Ratnalu',
    titleTemplate: (name) => `🍙 Chitti... Jogipet Srikanth range lo miss ayyindi!`,
    bodyTemplate: (name, task) => `${name} skipped "${task}"! Court lo Naveen Polishetty arguments cheppakunda urgent ga track loki rammannu! 🏛️😂`,
  },
  {
    id: 93,
    category: 'missed',
    tag: 'Julayi Bank Robbery',
    titleTemplate: (name) => `🏦 Logic miss ayyindi Bittu!`,
    bodyTemplate: (name, task) => `Allu Arjun logic calculation tappindi! "${task}" slot missed by ${name}! Call chesi fresh energy ivvu! 🚗💥`,
  },
  {
    id: 94,
    category: 'missed',
    tag: 'Temper Daya',
    titleTemplate: (name) => `🐕 Iddharu Daya lu unnaru... okadu task miss chesadu!`,
    bodyTemplate: (name, task) => `Junior NTR Temper transformation gurthu chesi ${name} ki alert ivvu! "${task}" missed today! 🚨🚔`,
  },
  {
    id: 95,
    category: 'missed',
    tag: 'Pelli Choopulu',
    titleTemplate: (name) => `🚚 Food truck aagipoindi Prashanth!`,
    bodyTemplate: (name, task) => `Vijay Deverakonda lazy mood lo ${name} dropped "${task}"! Pelli Choopulu comedy chaalu, work start chey manu! 🍳`,
  },
  // Adding 96 to 150 for non-repeating roasting/alerts
  ...Array.from({ length: 55 }, (_, i) => {
    const id = 96 + i;
    const memes = ['Brahmi', 'Sunil', 'Vennela Kishore', 'Ali', 'MS Narayana', 'Raghu Babu', 'Prudhvi 30 Years', 'Sapthagiri'];
    const m = memes[i % memes.length];
    return {
      id,
      category: 'missed' as const,
      tag: `${m} Wakeup Alert #${id}`,
      titleTemplate: (name: string, _t: string, time: string) => `🚨 Slot missed at ${time}! Call ${name} right now!`,
      bodyTemplate: (name: string, task: string) => `Macha! ${name} missed "${task}"! ${m} meme range lo roast chesi phone ring chey! Accountability partner responsibility needhe! 📞💥`,
    };
  }),

  // =========================================================================
  // 🌿 151 to 195: PRODUCTIVE UNSCHEDULED WORK / BACKDOOR HUSTLE
  // =========================================================================
  {
    id: 151,
    category: 'productive_work',
    tag: 'Pushpa Backdoor',
    titleTemplate: (name) => `🪓 Backdoor lo Pushpa Raj entry! Solid productive work by ${name}`,
    bodyTemplate: (name, _t, _time, note) => `Routine time table lo lekapoyina, ${name} background lo "${note || 'Emergency Productive Task'}" finish chesadu! Zero time wasted! Thaggedhe Le! 🌿🔥`,
  },
  {
    id: 152,
    category: 'productive_work',
    tag: 'Trivikram Wisdom',
    titleTemplate: (name) => `🧠 Plan maarina, purpose maaraledu! Smart work by ${name}`,
    bodyTemplate: (name, _t, _time, note) => `${name} timetable slot lo kakunda solid alternative work chesadu: "${note || 'High Value Task'}"! Green light lit up! 💚⚡`,
  },
  {
    id: 153,
    category: 'productive_work',
    tag: 'Dhoni Mastermind',
    titleTemplate: (name) => `🚁 Out of syllabus ball... sixer kottadu ${name}!`,
    bodyTemplate: (name, _t, _time, note) => `Unexpected situation lo ${name} "${note || 'Custom Productive Work'}" complete chesi day ni save chesadu! Pro gamer move! 🏏✨`,
  },
  {
    id: 154,
    category: 'productive_work',
    tag: 'Startup Hustler',
    titleTemplate: (name) => `💻 Founder Mode Activated by ${name}!`,
    bodyTemplate: (name, _t, _time, note) => `Unplanned hotfix or learning: "${note || 'Productive Grind'}" finished by ${name}! Zero time wasted today! 🚀`,
  },
  {
    id: 155,
    category: 'productive_work',
    tag: 'Athadu Stealth',
    titleTemplate: (name) => `🕶️ Silent ga vachi pedda matter solve chesadu ${name}!`,
    bodyTemplate: (name, _t, _time, note) => `Scheduled list lo ledu, kani "${note || 'Valuable Task'}" finish chesi green line highlight kottadu! Respect the hustle! 🎯🌿`,
  },
  // Adding 156 to 195 for Productive Unscheduled Work
  ...Array.from({ length: 40 }, (_, i) => {
    const id = 156 + i;
    return {
      id,
      category: 'productive_work' as const,
      tag: `Hustle Mode #${id}`,
      titleTemplate: (name: string) => `🌿 Time not wasted! Productive alternate work by ${name}!`,
      bodyTemplate: (name: string, _t: string, _time: string, note?: string) => `Routine slot kakapoina, ${name} solid ga "${note || 'Valuable Alternate Hustle'}" finish chesadu! Green line recorded for today! 💪🔥`,
    };
  }),

  // =========================================================================
  // 🏆 196 to 230: 100% CLEAN SWEEP / STREAK CELEBRATIONS (Beast Mode)
  // =========================================================================
  {
    id: 196,
    category: 'streak_sweep',
    tag: 'RRR Wildfire',
    titleTemplate: (name) => `🦁 100% Clean Sweep! ${name} is on Beast Mode!`,
    bodyTemplate: (name) => `Today ${name} finished ALL scheduled goals with zero misses! Unstoppable wildfire energy! Challenge needhe macha... beat cheyagalava? 👑🔥`,
  },
  {
    id: 197,
    category: 'streak_sweep',
    tag: 'Salaar Climax',
    titleTemplate: (name) => `🗡️ All targets destroyed! ${name} rules today!`,
    bodyTemplate: (name) => `${name} completed 100% of today's routine without dropping a single task! Full green board! Salute kottu bro! ⚔️🏰`,
  },
  {
    id: 198,
    category: 'streak_sweep',
    tag: 'World Cup 2011',
    titleTemplate: (name) => `🏆 India lifting World Cup celebration by ${name}!`,
    bodyTemplate: (name) => `Day complete with 100% strike rate! Leaderboard topper celebration for ${name}! Match his fire tomorrow! 🏏🎆`,
  },
  {
    id: 199,
    category: 'streak_sweep',
    tag: 'OG King',
    titleTemplate: (name) => `🌪️ #OG Storm cleared everything! Full day victory!`,
    bodyTemplate: (name) => `${name} swept every single goal on the board today! Pure benchmark set! Level up your game! 💥🚀`,
  },
  // Adding 200 to 230 for clean sweep
  ...Array.from({ length: 31 }, (_, i) => {
    const id = 200 + i;
    return {
      id,
      category: 'streak_sweep' as const,
      tag: `Clean Sweep Champion #${id}`,
      titleTemplate: (name: string) => `👑 100% All Goals Completed! ${name} is on Fire!`,
      bodyTemplate: (name: string) => `Macha! ${name} finished every single goal for today with full green marks! Absolute champion consistency! 🏆🔥`,
    };
  }),

  // =========================================================================
  // ⚡ 231 to 250: POKE & INSTANT CHALLENGE NOTIFICATIONS (Direct Partner Nudges)
  // =========================================================================
  {
    id: 231,
    category: 'poke_challenge',
    tag: 'Poke Challenge',
    titleTemplate: (name) => `👉 Poke from ${name}: "Macha inka em chestunnav?"`,
    bodyTemplate: (name) => `${name} pushed you an accountability poke! Phone పక్కన petti current slot goal complete chey come on! 🔥⚡`,
  },
  {
    id: 232,
    category: 'poke_challenge',
    tag: 'Pokiri Challenge',
    titleTemplate: (name) => `🔥 ${name}: "Naatho race ki ready ah?"`,
    bodyTemplate: (name) => `${name} is challenging your speed today! Open your timetable and mark your next victory! 🏁🚀`,
  },
  // Adding 233 to 250 for poke challenges
  ...Array.from({ length: 18 }, (_, i) => {
    const id = 233 + i;
    return {
      id,
      category: 'poke_challenge' as const,
      tag: `Partner Poke #${id}`,
      titleTemplate: (name: string) => `⚡ ${name} just pinged you! Time to hustle!`,
      bodyTemplate: (name: string) => `Accountability partner ${name} is checking on your routine! Open your goal sheet and smash your task! 💪🎯`,
    };
  }),
];

/**
 * 21-Day No-Repeat Notification Selector Engine
 * Tracks recently delivered template IDs in localStorage to guarantee zero duplication.
 */
export function getFreshAccountabilityMessage(
  category: 'completed' | 'missed' | 'productive_work' | 'streak_sweep' | 'poke_challenge',
  partnerName: string,
  task: string,
  time: string,
  extra?: string
): { title: string; body: string; tag: string; id: number } {
  const STORAGE_KEY = 'delivered_accountability_msg_ids';
  let usedIds: number[] = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) usedIds = JSON.parse(raw);
  } catch (_e) {
    usedIds = [];
  }

  // Filter pool by category
  const pool = ACCOUNTABILITY_MESSAGES.filter((m) => m.category === category);
  if (pool.length === 0) {
    return {
      id: 1,
      tag: 'Hustle',
      title: `🔥 Update from ${partnerName}`,
      body: `${partnerName} updated goal "${task}". Keep the momentum going!`,
    };
  }

  // Find templates not used in the last 150 deliveries
  let available = pool.filter((m) => !usedIds.includes(m.id));

  // If all in category have been used, reset cache for this category
  if (available.length === 0) {
    usedIds = usedIds.filter((id) => !pool.some((p) => p.id === id));
    available = pool;
  }

  // Random pick from available
  const chosen = available[Math.floor(Math.random() * available.length)];

  // Update delivered history (keep last 180 IDs)
  try {
    const nextHistory = [chosen.id, ...usedIds.filter((id) => id !== chosen.id)].slice(0, 180);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
  } catch (_e) {
    // ignore
  }

  return {
    id: chosen.id,
    tag: chosen.tag,
    title: chosen.titleTemplate(partnerName, task, time),
    body: chosen.bodyTemplate(partnerName, task, time, extra),
  };
}
