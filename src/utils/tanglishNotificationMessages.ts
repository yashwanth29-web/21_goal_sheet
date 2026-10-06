/**
 * 100 Unique Friendly Telugu-English (Tanglish) Hype Notification Messages
 * Written in natural English-script Tanglish with Telugu cinema hype, bro vibe, and zero repetition.
 * Dynamically injects {task} and {time}.
 */

export interface TanglishMessageTemplate {
  id: number;
  category: 'morning' | 'focus' | 'afternoon' | 'evening' | 'night' | 'hero_hype';
  titleTemplate: (task: string, time: string) => string;
  bodyTemplate: (task: string, time: string) => string;
}

export const TANGLISH_NOTIFICATIONS: TanglishMessageTemplate[] = [
  // ==========================================
  // 🌅 1-20: MORNING & EARLY RISER HUSTLE
  // ==========================================
  {
    id: 1,
    category: 'morning',
    titleTemplate: (_t, time) => `🔥 Rey macha, time ayyindi! (${time})`,
    bodyTemplate: (task, _time) => `Inka bed meeda padukundi chaalu bro, lesi ventane "${task}" start chey! Ee roju mana streak thaggedhe le! 💪⚡`,
  },
  {
    id: 2,
    category: 'morning',
    titleTemplate: (task, _time) => `🌅 Subhodayam champ! Time for "${task}"`,
    bodyTemplate: (task, _time) => `Early bird gets the glory antaru! Chakkaga "${task}" complete chesi first victory kottey! 🚀`,
  },
  {
    id: 3,
    category: 'morning',
    titleTemplate: (_t, time) => `⏰ Orey sleep prince, slot vacchesindi! (${time})`,
    bodyTemplate: (task, _time) => `Nidra moham kadukuni straight ga "${task}" meeda kurcho! Today is full fire mode! 🔥`,
  },
  {
    id: 4,
    category: 'morning',
    titleTemplate: (task, _time) => `⚡ Pushpa style lo "${task}" modalupettu!`,
    bodyTemplate: (task, _time) => `Evvaru aaperu bro manalni! "${task}" finish chesi green tick tho shock ivvu! Thaggedhe le! 💥`,
  },
  {
    id: 5,
    category: 'morning',
    titleTemplate: (_t, time) => `🎯 Slot bell mogindi bro! (${time})`,
    bodyTemplate: (task, _time) => `Morning fresh mood lo unnapude "${task}" kummeyali. Fast ga finish cheddam come on! 💪`,
  },
  {
    id: 6,
    category: 'morning',
    titleTemplate: (task, _time) => `☕ Chai taagesava? Now time for "${task}"`,
    bodyTemplate: (task, _time) => `Brain full charged ga undi kada, ippude "${task}" start chesi half done chesey! 🔥`,
  },
  {
    id: 7,
    category: 'morning',
    titleTemplate: (_t, time) => `☀️ Wake up warrior! (${time})`,
    bodyTemplate: (task, _time) => `World inka nidrapotundi, nuvvu matram "${task}" tho munduku vellu! Solid kickstart! ⚡`,
  },
  {
    id: 8,
    category: 'morning',
    titleTemplate: (task, _time) => `🚀 Today target: "${task}" 100% finish!`,
    bodyTemplate: (task, _time) => `Consistency is key guru! Ippude "${task}" start cheste daylight lo peaceful ga undocchu! 🎯`,
  },
  {
    id: 9,
    category: 'morning',
    titleTemplate: (_t, time) => `💥 Salaar intensity tho digu! (${time})`,
    bodyTemplate: (task, _time) => `Dhinamma "${task}" ni chekki padesey! Zero excuses today, lets go! 💪`,
  },
  {
    id: 10,
    category: 'morning',
    titleTemplate: (task, _time) => `🏃‍♂️ No laziness, only action for "${task}"!`,
    bodyTemplate: (task, _time) => `5 minutes lo start chey, flow vacchestadi! "${task}" green mark pakka padali! ⚡`,
  },
  {
    id: 11,
    category: 'morning',
    titleTemplate: (_t, time) => `🔔 Time check macha! (${time})`,
    bodyTemplate: (task, _time) => `Time waste cheyyakunda "${task}" open chey. Leaderboard lo top lo undali mana peru! 🏆`,
  },
  {
    id: 12,
    category: 'morning',
    titleTemplate: (task, _time) => `🌟 Star start to the day: "${task}"!`,
    bodyTemplate: (task, _time) => `Ee roju manchi positive energy tho "${task}" kick off cheddam. Ready ah? 🔥`,
  },
  {
    id: 13,
    category: 'morning',
    titleTemplate: (_t, time) => `🔥 Bob dialogue gurthunda? (${time})`,
    bodyTemplate: (task, _time) => `Okkasaari commit aithe mana maata maname vinakudadhu! "${task}" start chesey! 🎯`,
  },
  {
    id: 14,
    category: 'morning',
    titleTemplate: (task, _time) => `⚡ High voltage morning for "${task}"!`,
    bodyTemplate: (task, _time) => `Battery 100% undi kada, energy motham "${task}" meeda pettey bro! 💪`,
  },
  {
    id: 15,
    category: 'morning',
    titleTemplate: (_t, time) => `🎯 Slot countdown finished! (${time})`,
    bodyTemplate: (task, _time) => `Timer ticking macha! "${task}" lo dooki finish chesey! 🔥`,
  },
  {
    id: 16,
    category: 'morning',
    titleTemplate: (task, _time) => `🌅 Best morning ever with "${task}"!`,
    bodyTemplate: (task, _time) => `Ee slot lo "${task}" utilise chesko, roju motham pride ga feel avthav! 🚀`,
  },
  {
    id: 17,
    category: 'morning',
    titleTemplate: (_t, time) => `💪 Beast mode on! (${time})`,
    bodyTemplate: (task, _time) => `Morning slot lo dhummu lepalante "${task}" finish cheyyalsinde! Let's do it! 💥`,
  },
  {
    id: 18,
    category: 'morning',
    titleTemplate: (task, _time) => `✨ Champion mindset: "${task}" today!`,
    bodyTemplate: (task, _time) => `Great things start small. Ee roju "${task}" tho start chesi step up chey! 🏆`,
  },
  {
    id: 19,
    category: 'morning',
    titleTemplate: (_t, time) => `⏰ Alarm kante fast ga digu! (${time})`,
    bodyTemplate: (task, _time) => `Mana goal tracking lo zero misses undali. "${task}" start chesi speed chupinchu! ⚡`,
  },
  {
    id: 20,
    category: 'morning',
    titleTemplate: (task, _time) => `🔥 RRR level fire with "${task}"!`,
    bodyTemplate: (task, _time) => `Ram & Bheem laaga energy tho "${task}" ni kottu bro! Lets crush this goal! 🎯`,
  },

  // ==========================================
  // 💻 21-45: MID-MORNING & DEEP FOCUS / WORK
  // ==========================================
  {
    id: 21,
    category: 'focus',
    titleTemplate: (task, time) => `💻 Focus Mode Locked: "${task}" (${time})`,
    bodyTemplate: (task, _time) => `Phone silent lo petti, 100% attention "${task}" meeda pettu bro! Deep work time! ⚡`,
  },
  {
    id: 22,
    category: 'focus',
    titleTemplate: (_t, time) => `🎯 Orey champ! Target time! (${time})`,
    bodyTemplate: (task, _time) => `Ee slot lo distaction lekunda "${task}" aipogottali! Green tick manade! 🚀`,
  },
  {
    id: 23,
    category: 'focus',
    titleTemplate: (task, _time) => `🔥 Athadu precision tho "${task}" chey!`,
    bodyTemplate: (task, _time) => `Target meeda nundi focus povadhu! "${task}" ni perfect ga finish chey! 🎯`,
  },
  {
    id: 24,
    category: 'focus',
    titleTemplate: (_t, time) => `⚡ Prime productivity hour! (${time})`,
    bodyTemplate: (task, _time) => `Brain super sharp ga unde time idi. "${task}" tasks anni rapid ga tick chesey! 💪`,
  },
  {
    id: 25,
    category: 'focus',
    titleTemplate: (task, _time) => `🚀 Big move today: "${task}"!`,
    bodyTemplate: (task, _time) => `Small daily progress leads to huge success bro. "${task}" meeda full focus pettu! 🏆`,
  },
  {
    id: 26,
    category: 'focus',
    titleTemplate: (_t, time) => `🛑 Reels apesey macha! (${time})`,
    bodyTemplate: (task, _time) => `Instagram scroll chesindi chalu, "${task}" open chesi pani chusko! Future lo thank cheskuntav! 🔥`,
  },
  {
    id: 27,
    category: 'focus',
    titleTemplate: (task, _time) => `💎 Pure diamond focus for "${task}"!`,
    bodyTemplate: (task, _time) => `One goal at a time bro. Ippudu "${task}" complete cheste mental relief untadi! ✨`,
  },
  {
    id: 28,
    category: 'focus',
    titleTemplate: (_t, time) => `🔥 Devara speed tho digu! (${time})`,
    bodyTemplate: (task, _time) => `Bayapadatam ledu, aagatam ledu! "${task}" ni finish chesi record kottu! 🌊⚡`,
  },
  {
    id: 29,
    category: 'focus',
    titleTemplate: (task, _time) => `🎯 Bullseye target: "${task}"`,
    bodyTemplate: (task, _time) => `Clear head tho kurcho, step-by-step ga "${task}" complete chey bro! 💪`,
  },
  {
    id: 30,
    category: 'focus',
    titleTemplate: (_t, time) => `⚡ Zero delay policy! (${time})`,
    bodyTemplate: (task, _time) => `Ippude right moment! "${task}" start chesi checklist tick chesey! 🚀`,
  },
  {
    id: 31,
    category: 'focus',
    titleTemplate: (task, _time) => `🧠 Smart work time for "${task}"!`,
    bodyTemplate: (task, _time) => `Focus petti cheste fast ga aipotadi bro. Let's conquer "${task}" right now! 🔥`,
  },
  {
    id: 32,
    category: 'focus',
    titleTemplate: (_t, time) => `🏆 Leaderboard calling you! (${time})`,
    bodyTemplate: (task, _time) => `Friends andaru track chestunnaru! "${task}" complete chesi top rank retain chey! 🥇`,
  },
  {
    id: 33,
    category: 'focus',
    titleTemplate: (task, _time) => `⚡ Game on macha for "${task}"!`,
    bodyTemplate: (task, _time) => `Ee slot skip cheyyakudadhu, solid ga attend ayyi "${task}" mark kottu! 💥`,
  },
  {
    id: 34,
    category: 'focus',
    titleTemplate: (_t, time) => `🔥 Baahubali courage tho kurcho! (${time})`,
    bodyTemplate: (task, _time) => `Mahendra Baahubali laaga e "${task}" parvatam ni lepesey bro! 🛡️💪`,
  },
  {
    id: 35,
    category: 'focus',
    titleTemplate: (task, _time) => `⏱️ 25 Mins sprint for "${task}"!`,
    bodyTemplate: (task, _time) => `Just 25 mins deep focus pettu, "${task}" lo major chunk aipotadi! Let's go! 🎯`,
  },
  {
    id: 36,
    category: 'focus',
    titleTemplate: (_t, time) => `✨ Build your momentum! (${time})`,
    bodyTemplate: (task, _time) => `Momentum start aithe aagadam impossible! "${task}" execute chesey! ⚡`,
  },
  {
    id: 37,
    category: 'focus',
    titleTemplate: (task, _time) => `🔥 Gabbar Singh punch for "${task}"!`,
    bodyTemplate: (task, _time) => `Naku konchem thikkundi, kaani daaniko lekkundi! "${task}" finish chesey! 🤠💥`,
  },
  {
    id: 38,
    category: 'focus',
    titleTemplate: (_t, time) => `🚀 Sprint slot is live! (${time})`,
    bodyTemplate: (task, _time) => `No multitasking, just pure execution on "${task}"! Let's get it done! 🏆`,
  },
  {
    id: 39,
    category: 'focus',
    titleTemplate: (task, _time) => `⚡ High priority alert: "${task}"!`,
    bodyTemplate: (task, _time) => `"${task}" mana core goal bro, eppatiki postpone cheyyaddu! Ippude finish chey! 🎯`,
  },
  {
    id: 40,
    category: 'focus',
    titleTemplate: (_t, time) => `🔥 DJ mode lo speed penchu! (${time})`,
    bodyTemplate: (task, _time) => `Seeti mar style lo "${task}" aipogottu! Speed and perfection! 🎶💥`,
  },
  {
    id: 41,
    category: 'focus',
    titleTemplate: (task, _time) => `🎯 Consistency master: "${task}"!`,
    bodyTemplate: (task, _time) => `Daily trackers lo top consistency kavalante "${task}" miss cheyyaku bro! ⚡`,
  },
  {
    id: 42,
    category: 'focus',
    titleTemplate: (_t, time) => `💪 You got this bro! (${time})`,
    bodyTemplate: (task, _time) => `Konchem concentrate chey, "${task}" complete ayyaka super relief untadi! 🚀`,
  },
  {
    id: 43,
    category: 'focus',
    titleTemplate: (task, _time) => `🌟 Pro-level work on "${task}"!`,
    bodyTemplate: (task, _time) => `Amateurs wait for mood, pros show up! "${task}" start chey champ! 🔥`,
  },
  {
    id: 44,
    category: 'focus',
    titleTemplate: (_t, time) => `⚡ Laser beam focus on! (${time})`,
    bodyTemplate: (task, _time) => `Eyes on the prize! "${task}" complete chesi next level ki vellu! 🎯`,
  },
  {
    id: 45,
    category: 'focus',
    titleTemplate: (task, _time) => `🔥 Fire performance for "${task}"!`,
    bodyTemplate: (task, _time) => `Ee slot lo mana energy chupiddam bro. Let's finish "${task}" with style! 💥`,
  },

  // ==========================================
  // ⚡ 46-65: AFTERNOON BEAT-THE-SLUMP GRIND
  // ==========================================
  {
    id: 46,
    category: 'afternoon',
    titleTemplate: (_t, time) => `😴 Afternoon baddhakam vaddhu bro! (${time})`,
    bodyTemplate: (task, _time) => `Mokham meeda water jallukuni fresh ga "${task}" start chey! Lazy mode off! 💦🔥`,
  },
  {
    id: 47,
    category: 'afternoon',
    titleTemplate: (task, _time) => `💥 Beat the slump with "${task}"!`,
    bodyTemplate: (task, _time) => `Afternoon lo productivity maintain chestene true legend antaru! Finish "${task}"! 🏆`,
  },
  {
    id: 48,
    category: 'afternoon',
    titleTemplate: (_t, time) => `☕ Post-lunch boost time! (${time})`,
    bodyTemplate: (task, _time) => `Chai / Coffee break aipoindi kada, ippudu direct ga "${task}" meeda padu! ⚡`,
  },
  {
    id: 49,
    category: 'afternoon',
    titleTemplate: (task, _time) => `🔥 Guntur Kaaram style fire on "${task}"!`,
    bodyTemplate: (task, _time) => `Spicy ga active ga undali bro! "${task}" finish chesi aagi chupinchu! 🌶️💥`,
  },
  {
    id: 50,
    category: 'afternoon',
    titleTemplate: (_t, time) => `🎯 Afternoon power slot! (${time})`,
    bodyTemplate: (task, _time) => `Time fast ga run aipotundi macha, "${task}" ni quickly execute chesey! 🚀`,
  },
  {
    id: 51,
    category: 'afternoon',
    titleTemplate: (task, _time) => `⚡ Halfway through the day: "${task}"!`,
    bodyTemplate: (task, _time) => `Eppatike half day successful ga nadichindi, "${task}" tho continue chey! 💪`,
  },
  {
    id: 52,
    category: 'afternoon',
    titleTemplate: (_t, time) => `🛑 Phone scroll aapi pani chusko! (${time})`,
    bodyTemplate: (task, _time) => `Inka reels chusindi chaalu, "${task}" complete chesi green tick kottuko! 📱❌`,
  },
  {
    id: 53,
    category: 'afternoon',
    titleTemplate: (task, _time) => `🏆 Protect your daily rank with "${task}"!`,
    bodyTemplate: (task, _time) => `Friends tracking lo unnaru bro, "${task}" vadilesthe rank padipotadi! Kummey! 🔥`,
  },
  {
    id: 54,
    category: 'afternoon',
    titleTemplate: (_t, time) => `🔥 Sarileru Neekevvaru speed! (${time})`,
    bodyTemplate: (task, _time) => `Nuvvu thaggedhi ledu! "${task}" lo perfect accuracy maintain chey bro! 🎖️`,
  },
  {
    id: 55,
    category: 'afternoon',
    titleTemplate: (task, _time) => `⚡ Quick win incoming on "${task}"!`,
    bodyTemplate: (task, _time) => `Just 30 minutes solid effort pettu, "${task}" aipoyi full satisfaction istadi! 🎯`,
  },
  {
    id: 56,
    category: 'afternoon',
    titleTemplate: (_t, time) => `💥 Mind full active chey! (${time})`,
    bodyTemplate: (task, _time) => `Drowsiness ni tharimi kotti "${task}" meeda jump chey macha! Let's go! 🚀`,
  },
  {
    id: 57,
    category: 'afternoon',
    titleTemplate: (task, _time) => `🌟 Unstoppable energy for "${task}"!`,
    bodyTemplate: (task, _time) => `Consistency streak active ga undali ante prathi slot important! "${task}" start now! ⚡`,
  },
  {
    id: 58,
    category: 'afternoon',
    titleTemplate: (_t, time) => `🔥 Vikramarkudu duty mode! (${time})`,
    bodyTemplate: (task, _time) => `Duty lo compromise undadhu! "${task}" ni complete chesi clean sweep chey! 👮‍♂️💪`,
  },
  {
    id: 59,
    category: 'afternoon',
    titleTemplate: (task, _time) => `🎯 Steady focus on "${task}"!`,
    bodyTemplate: (task, _time) => `Slow and steady wins the race antaru, solid ga "${task}" complete chey bro! ✨`,
  },
  {
    id: 60,
    category: 'afternoon',
    titleTemplate: (_t, time) => `⚡ Time flies macha! (${time})`,
    bodyTemplate: (task, _time) => `Evening aipoyelope "${task}" mark cheskunte evening chill avvocchu! Start now! 🔥`,
  },
  {
    id: 61,
    category: 'afternoon',
    titleTemplate: (task, _time) => `💪 Champion grit for "${task}"!`,
    bodyTemplate: (task, _time) => `Boredom ni beat chesi task chesevade winner! "${task}" aipogottu! 🏆`,
  },
  {
    id: 62,
    category: 'afternoon',
    titleTemplate: (_t, time) => `🚀 Level up your skills! (${time})`,
    bodyTemplate: (task, _time) => `Daily practice tho ne mastery vasthadi. "${task}" do right now! 🎯`,
  },
  {
    id: 63,
    category: 'afternoon',
    titleTemplate: (task, _time) => `🔥 Mass action on "${task}"!`,
    bodyTemplate: (task, _time) => `Full mass energy tho "${task}" start chesi done ani status marchu! 💥`,
  },
  {
    id: 64,
    category: 'afternoon',
    titleTemplate: (_t, time) => `⚡ Stay ahead of the curve! (${time})`,
    bodyTemplate: (task, _time) => `Procrastination ki chance ivvaku bro! "${task}" ni ippude kottu! 🏹`,
  },
  {
    id: 65,
    category: 'afternoon',
    titleTemplate: (task, _time) => `✨ Finish strong with "${task}"!`,
    bodyTemplate: (task, _time) => `Day ending lo happy ga undalante ippudu "${task}" compulsory complete cheyali! 💪`,
  },

  // ==========================================
  // 🔥 66-85: EVENING POWER RUSH & WORKOUT
  // ==========================================
  {
    id: 66,
    category: 'evening',
    titleTemplate: (_t, time) => `🌆 Evening power slot is on! (${time})`,
    bodyTemplate: (task, _time) => `Sun set avtundi, but mana energy rise avvali! "${task}" complete chesi kottu! 🌅🔥`,
  },
  {
    id: 67,
    category: 'evening',
    titleTemplate: (task, _time) => `💪 Beast mode evening for "${task}"!`,
    bodyTemplate: (task, _time) => `Gym or work edaina sare, 100% effort petti "${task}" ni break chesey! 🏋️‍♂️⚡`,
  },
  {
    id: 68,
    category: 'evening',
    titleTemplate: (_t, time) => `🔥 Race Gurram speed tho digu! (${time})`,
    bodyTemplate: (task, _time) => `Frustration vaddhu, full dedication tho "${task}" aipogottu macha! 🐎💨`,
  },
  {
    id: 69,
    category: 'evening',
    titleTemplate: (task, _time) => `🎯 Evening target alert: "${task}"!`,
    bodyTemplate: (task, _time) => `Today almost full success avtundi, "${task}" kooda complete chesi wrap chey! 🚀`,
  },
  {
    id: 70,
    category: 'evening',
    titleTemplate: (_t, time) => `⚡ Refresh & Conquer! (${time})`,
    bodyTemplate: (task, _time) => `Snack / Chai aipoindi kada, fresh mind tho "${task}" ni crack chey bro! ☕💪`,
  },
  {
    id: 71,
    category: 'evening',
    titleTemplate: (task, _time) => `🔥 Mirchi movie spicy hype for "${task}"!`,
    bodyTemplate: (task, _time) => `Veelaithe preminchu, lekapothe "${task}" finish chesi pandaga chesko! 🌶️😎`,
  },
  {
    id: 72,
    category: 'evening',
    titleTemplate: (_t, time) => `🏆 Final laps of the day! (${time})`,
    bodyTemplate: (task, _time) => `Day finish line daggariki vacchesam! "${task}" ni tick kotti lead teesko! 🥇`,
  },
  {
    id: 73,
    category: 'evening',
    titleTemplate: (task, _time) => `⚡ High tempo execution on "${task}"!`,
    bodyTemplate: (task, _time) => `Speed penchu bro, fast ga "${task}" complete cheste night free ga chill avvocchu! 🎧✨`,
  },
  {
    id: 74,
    category: 'evening',
    titleTemplate: (_t, time) => `🔥 Kalki future hero energy! (${time})`,
    bodyTemplate: (task, _time) => `Future ni build cheyyalante daily "${task}" discipline maintain cheyyalsinde! 🛸⚡`,
  },
  {
    id: 75,
    category: 'evening',
    titleTemplate: (task, _time) => `💥 Smash your goals: "${task}"!`,
    bodyTemplate: (task, _time) => `Zero hesitation, direct action! "${task}" start chesi result chudu bro! 🎯`,
  },
  {
    id: 76,
    category: 'evening',
    titleTemplate: (_t, time) => `🌟 Evening star performer! (${time})`,
    bodyTemplate: (task, _time) => `Nuvvu consistent ga unte evaru aaperu! "${task}" finish chesi showcase chey! 💫`,
  },
  {
    id: 77,
    category: 'evening',
    titleTemplate: (task, _time) => `🔥 Attarintiki Daredi confidence on "${task}"!`,
    bodyTemplate: (task, _time) => `Chuste class, digithe mass! "${task}" complete chesi record create chey! 🎩💥`,
  },
  {
    id: 78,
    category: 'evening',
    titleTemplate: (_t, time) => `⚡ Lock your focus macha! (${time})`,
    bodyTemplate: (task, _time) => `Distractions anni cut off chey, "${task}" meeda concentrate chey! Let's go! 🔒`,
  },
  {
    id: 79,
    category: 'evening',
    titleTemplate: (task, _time) => `💪 Solid workout / task for "${task}"!`,
    bodyTemplate: (task, _time) => `Ee roju effort repu confidence istadi! "${task}" full ga finish chey! 🏋️‍♀️⚡`,
  },
  {
    id: 80,
    category: 'evening',
    titleTemplate: (_t, time) => `🎯 Golden hour productivity! (${time})`,
    bodyTemplate: (task, _time) => `Evening lights lo peaceful ga "${task}" aipogottu bro! Great feeling! 🌇`,
  },
  {
    id: 81,
    category: 'evening',
    titleTemplate: (task, _time) => `🔥 Legend attitude for "${task}"!`,
    bodyTemplate: (task, _time) => `Mee commitment ki salute bro! "${task}" ni finish chesi green mark chesko! 👑`,
  },
  {
    id: 82,
    category: 'evening',
    titleTemplate: (_t, time) => `⚡ Power packed hour! (${time})`,
    bodyTemplate: (task, _time) => `Ee hour lo dhummu lepu bro! "${task}" finish chesi celebration ki ready avvu! 🚀`,
  },
  {
    id: 83,
    category: 'evening',
    titleTemplate: (task, _time) => `💥 Pokiri punch time on "${task}"!`,
    bodyTemplate: (task, _time) => `Okkasaari goal fix aithe backstep vese prashne ledu! Complete "${task}"! 🔫😎`,
  },
  {
    id: 84,
    category: 'evening',
    titleTemplate: (_t, time) => `🏆 One more step to 100%! (${time})`,
    bodyTemplate: (task, _time) => `Almost all slots done! "${task}" ni kooda aipogotti 100% green calendar chey! 🟢`,
  },
  {
    id: 85,
    category: 'evening',
    titleTemplate: (task, _time) => `✨ Unbeatable daily drive on "${task}"!`,
    bodyTemplate: (task, _time) => `Mee consistency chusi friends surprise avvali! "${task}" finish now! 🔥`,
  },

  // ==========================================
  // 🌙 86-100: NIGHT WRAP-UP & STREAK LOCK
  // ==========================================
  {
    id: 86,
    category: 'night',
    titleTemplate: (_t, time) => `🌙 Night wrap-up time bro! (${time})`,
    bodyTemplate: (task, _time) => `Padukune mundu "${task}" status update chey! Streak break avvakunda kapadu! 🔒🔥`,
  },
  {
    id: 87,
    category: 'night',
    titleTemplate: (task, _time) => `🟢 Green tick check: "${task}"!`,
    bodyTemplate: (task, _time) => `Ee roju "${task}" status emaindi bro? Completed aythe green tick kotti sleep tight! 🎯`,
  },
  {
    id: 88,
    category: 'night',
    titleTemplate: (_t, time) => `🔥 Lock your streak macha! (${time})`,
    bodyTemplate: (task, _time) => `Hard work waste avvakudadhu! "${task}" ni mark chesi 100% consistent ga undu! ⚡`,
  },
  {
    id: 89,
    category: 'night',
    titleTemplate: (task, _time) => `🏆 Champion day summary: "${task}"!`,
    bodyTemplate: (task, _time) => `Super effort today! "${task}" checklist update chesi peaceful sleep teesko! 😴✨`,
  },
  {
    id: 90,
    category: 'night',
    titleTemplate: (_t, time) => `🌟 Star status lock! (${time})`,
    bodyTemplate: (task, _time) => `Ee roju calendar lo "${task}" green ga velagali! App open chesi status mark chey! 🟢💫`,
  },
  {
    id: 91,
    category: 'night',
    titleTemplate: (task, _time) => `⚡ Don't leave "${task}" blank!`,
    bodyTemplate: (task, _time) => `Grey box undakudadhu bro! "${task}" status update chesi calendar ni clean ga unchu! 📊`,
  },
  {
    id: 92,
    category: 'night',
    titleTemplate: (_t, time) => `🔥 RRR Naatu Naatu celebration! (${time})`,
    bodyTemplate: (task, _time) => `All goals completed aithe full Naatu Naatu dance veyocchu! Mark "${task}" now! 🕺🎉`,
  },
  {
    id: 93,
    category: 'night',
    titleTemplate: (task, _time) => `🌙 Bed time check-in for "${task}"!`,
    bodyTemplate: (task, _time) => `Just 10 seconds lo "${task}" log chesey bro. Consistency is power! 💪`,
  },
  {
    id: 94,
    category: 'night',
    titleTemplate: (_t, time) => `🛡️ Streak shield active! (${time})`,
    bodyTemplate: (task, _time) => `Daily streak ni safe ga unchataniki "${task}" status mark cheyyadam marchipoku! ⚡`,
  },
  {
    id: 95,
    category: 'night',
    titleTemplate: (task, _time) => `💎 Proud moment: "${task}" today!`,
    bodyTemplate: (task, _time) => `Nuvvu ee roju chesina effort waste avvadu! "${task}" mark chesi celebrate chey! 🥂✨`,
  },
  {
    id: 96,
    category: 'night',
    titleTemplate: (_t, time) => `🎯 Final score of the day! (${time})`,
    bodyTemplate: (task, _time) => `Leaderboard standings refresh avtunnai! "${task}" status confirm chesuko macha! 🥇`,
  },
  {
    id: 97,
    category: 'night',
    titleTemplate: (task, _time) => `🔥 Salaar Ceasefire mode for "${task}"!`,
    bodyTemplate: (task, _time) => `Day fight complete aipoindi! "${task}" tick kotti peaceful rest teesko bro! ⚔️😴`,
  },
  {
    id: 98,
    category: 'night',
    titleTemplate: (_t, time) => `✨ Tomorrow starts with today's win! (${time})`,
    bodyTemplate: (task, _time) => `Ee roju "${task}" successfully logged! Repu inkenta fire chupiddam! 🚀`,
  },
  {
    id: 99,
    category: 'night',
    titleTemplate: (task, _time) => `👑 King of consistency: "${task}"!`,
    bodyTemplate: (task, _time) => `Great job today bro! "${task}" record chesi calm ga nidrapodu. You nailed it! 🛌💤`,
  },
  {
    id: 100,
    category: 'night',
    titleTemplate: (_t, time) => `🔥 100/100 Victory Lap! (${time})`,
    bodyTemplate: (task, _time) => `Thaggedhe le! "${task}" logged, streak protected, winner mentality on! Good night macha! 🏆🔥`,
  },
];

/**
 * Smart Anti-Boredom Randomizer
 * Keeps a history of recently sent message IDs (last 30) so users never see repeats.
 */
export function getSmartTanglishNotification(
  taskName: string,
  timeSlot: string,
  preferredCategory?: 'morning' | 'focus' | 'afternoon' | 'evening' | 'night' | 'hero_hype'
): { title: string; body: string } {
  const safeTask = taskName?.trim() || 'Daily Goal Task';
  const safeTime = timeSlot?.trim() || 'Now';

  let currentCategory = preferredCategory;
  if (!currentCategory) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) currentCategory = 'morning';
    else if (hour >= 10 && hour < 13) currentCategory = 'focus';
    else if (hour >= 13 && hour < 17) currentCategory = 'afternoon';
    else if (hour >= 17 && hour < 21) currentCategory = 'evening';
    else currentCategory = 'night';
  }

  // Load recently used notification IDs from localStorage
  let recentIds: number[] = [];
  try {
    const stored = localStorage.getItem('recent_tanglish_notif_ids');
    if (stored) recentIds = JSON.parse(stored);
  } catch (_e) {
    recentIds = [];
  }

  // Filter messages by category if available, otherwise use all
  let candidates = TANGLISH_NOTIFICATIONS.filter((m) => m.category === currentCategory);
  if (candidates.length === 0) {
    candidates = TANGLISH_NOTIFICATIONS;
  }

  // Find candidate templates not in recentIds
  let freshCandidates = candidates.filter((m) => !recentIds.includes(m.id));
  if (freshCandidates.length === 0) {
    // If all in this category were used, fall back to any fresh candidate from all 100
    freshCandidates = TANGLISH_NOTIFICATIONS.filter((m) => !recentIds.includes(m.id));
    if (freshCandidates.length === 0) {
      // If literally all 100 were used, reset history
      recentIds = [];
      freshCandidates = candidates;
    }
  }

  // Pick a random fresh candidate
  const picked = freshCandidates[Math.floor(Math.random() * freshCandidates.length)] || TANGLISH_NOTIFICATIONS[0];

  // Update recent IDs history (retain last 30)
  recentIds.push(picked.id);
  if (recentIds.length > 35) {
    recentIds = recentIds.slice(recentIds.length - 35);
  }
  try {
    localStorage.setItem('recent_tanglish_notif_ids', JSON.stringify(recentIds));
  } catch (_e) {
    // ignore
  }

  return {
    title: picked.titleTemplate(safeTask, safeTime),
    body: picked.bodyTemplate(safeTask, safeTime),
  };
}
