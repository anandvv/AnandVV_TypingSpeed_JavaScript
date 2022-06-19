const gameContentEl = document.getElementById("gameContent");
const textInputEl = document.getElementById("textInput");
const timeEl = document.getElementById("timeDisplay");
const accuracyEl = document.getElementById("accuracyPercent");
const refreshGameEl = document.getElementById("btnRefresh");
const endStat1El = document.getElementById("endStat1");
const endStat2El = document.getElementById("endStat2");
const wordsPerMinuteEl = document.getElementById("wordsPerMinute");
const keyStrokesPerMinuteEl = document.getElementById("keyStrokesPerMinute")

var currentWordIndex = 1;
var wordsEnteredByUser = 0;
var correctWords = 0;
var incorrectWords = 0;
const timer = 30; //debug: change to 5 for debuggin, reset to 30 when code complete
var isGameStarted = false;
var seconds;
var wordsPerMinute = 0;
var keyStrokesPerMinute = 0;

//let's start the game at beginner level
restartGame();

//on Input
textInputEl.addEventListener('input', function(event){
  if(isGameStarted === false){
    isGameStarted = true;
    timeStart();
  }

  //increase keycount each time this event fires
  keyStrokesPerMinute++;

  var charEntered = event.data;
  
  //check if the character entered is a whitespace
  if(/\s/g.test(charEntered)){
    checkWord();
  }
});


//refresh the Test
refreshGameEl.addEventListener("click",function(){

  //reset counts
  wordsEnteredByUser = 0;
  correctWords = 0;
  incorrectWords = 0;

  //reset the game start flag
  isGameStarted = false;

  //reset css for the scores
  timeEl.classList.remove("current");
  accuracyPercent.classList.remove("current");
  errors.classList.remove("red");

  //reset scores
  timeEl.innerText = timer;
  errors.innerText = incorrectWords;
  accuracyPercent.innerText = "0%";

  //re-enable the input text box for adding items
  textInputEl.disabled = false;
  textInputEl.value = '';
  textInputEl.focus();

  restartGame();
  clearInterval(seconds);
});

//start the timer countdown
function timeStart(){
  seconds = setInterval(function() {
    timeEl.innerText--;
    if (timeEl.innerText === "0") {
      console.log("GAME OVER!!")
        timeOver();
        clearInterval(seconds);
    }
  }, 1000);
}

//diable textarea and wait for restart
function timeOver(){
  textInputEl.disabled = true;
  refreshGameEl.focus();

  displayScore();
}


//display the score
function displayScore(){

  //todo: calculate WPM
  if(wordsEnteredByUser !== 0){
    wordsPerMinute = (60 / timer) * wordsEnteredByUser;
  }

  wordsPerMinuteEl.innerText = wordsPerMinute;

  //todo: calculate CPM
  keyStrokesPerMinuteEl.innerText = keyStrokesPerMinute;

  //calculate %accuracy
  let percentageAccuracy = 0;
  if(wordsEnteredByUser !== 0){
    percentageAccuracy = Math.floor((correctWords/wordsEnteredByUser) * 100);
  }
  accuracyPercent.innerText = percentageAccuracy + "%";

  //show the hidden divs
  endStat1.classList.remove("hideAtStart");
  endStat2.classList.remove("hideAtStart");

  endStat1.classList.add("showAtEnd");
  endStat2.classList.add("showAtEnd");
}

//check if the user is entering current word
// function currentWord(){
//   const wordEntered = textInputEl.value;
//   const currentID = "word " + currentWordIndex;
//   const currentSpan = document.getElementById(currentID);
//   const curSpanWord = currentSpan.innerText;

//   //if current word, keep styling current
//   if(wordEntered == curSpanWord.substring(0,wordEntered.length)){
//     changeWordColor(currentID, 2);
//   }
//   else{ 
//     changeWordColor(currentID, 3);
//   }

// }

//checks word entered
function checkWord(){
  const wordEntered = textInputEl.value;
  textInputEl.value='';

  const wordID = "word " + currentWordIndex;
  const checkSpan = document.getElementById(wordID);
  currentWordIndex++;
  wordsEnteredByUser++;

  if(checkSpan.innerText === wordEntered){
    changeWordColor(wordID, 1);
    correctWords++;
  }
  else{
    changeWordColor(wordID, 3);
    incorrectWords++;
    errors.innerText = incorrectWords;
    if(incorrectWords > 0){
      errors.classList.add("red");
    }
  }

  if(currentWordIndex > 40){
    restartGame();
  }
  else{
    const nextID = "word "+currentWordIndex;
    changeWordColor(nextID, 2);
  }
}

//color the words
function changeWordColor(id, color){
  const span = document.getElementById(id);
  switch (color) {
    case 1:
      span.classList.remove('incorrect');
      span.classList.add('correct');
      break;
    case 2:
      span.classList.remove('correct');
      span.classList.remove('incorrect');
      break;  
    default:
      span.classList.remove('correct');
      span.classList.add('incorrect');
      break;
  }
}

//display the random words on screen
function restartGame(){
  currentWordIndex = 1;
  gameContentEl.innerHTML = '';

  let newTest = randomWords();
  newTest.forEach(function(word, i){
    let wordSpan = document.createElement('span');
    wordSpan.innerText = word;
    wordSpan.setAttribute("id", "word " + (i+1));
    gameContentEl.appendChild(wordSpan);
  });

  const nextID = "word "+ currentWordIndex;
  changeWordColor(nextID, 2);
}

//Generate an array of random words
function randomWords(){

  const easyWords = "a, about, above, across, act, active, activity, add, afraid, after, again, age, ago, agree, air, all, alone, along, already, always, am, amount, an, and, angry, another, answer, any, anyone, anything, anytime, appear, apple, are, area, arm, army, around, arrive, art, as, ask, at, attack, aunt, autumn, away, baby, back, bad, bag, ball, bank, base, basket, bath, be, bean, bear, beautiful, bed, bedroom, beer, behave, before, begin, behind, bell, below, besides, best, better, between, big, bird, birth, birthday, bit, bite, black, bleed, block, blood, blow, blue, board, boat, body, boil, bone, book, border, born, borrow, both, bottle, bottom, bowl, box, boy, branch, brave, bread, break, breakfast, breathe, bridge, bright, bring, brother, brown, brush, build, burn, business, bus, busy, but, buy, by, cake, call, can, candle, cap, car, card, care, careful, careless, carry, case, cat, catch, central, century, certain, chair, chance, change, chase, cheap, cheese, chicken, child, children, chocolate, choice, choose, circle, city, class, clever, clean, clear, climb, clock, cloth, clothes, cloud, cloudy, close, coffee, coat, coin, cold, collect, color, comb, comfortable, common, compare, come, complete, computer, condition, continue, control, cook, cool, copper, corn, corner, correct, cost, contain, count, country, course, cover, crash, cross, cry, cup, cupboard, cut, dance, dangerous, dark, daughter, day, dead, decide, decrease, deep, deer, depend, desk, destroy, develop, die, different, difficult, dinner, direction, dirty, discover, dish, do, dog, door, double, down, draw, dream, dress, drink, drive, drop, dry, duck, dust, duty, each, ear, early, earn, earth, east, easy, eat, education, effect, egg, eight, either, electric, elephant, else, empty, end, enemy, enjoy, enough, enter, equal, entrance, escape, even, evening, event, ever, every, everyone, exact, everybody, examination, example, except, excited, exercise, expect, expensive, explain, extremely, eye, face, fact, fail, fall, false, family, famous, far, farm, father, fast, fat, fault, fear, feed, feel, female, fever, few, fight, fill, film, find, fine, finger, finish, fire, first, fish, fit, five, fix, flat, float, floor, flour, flower, fly, fold, food, fool, foot, football, for, force, foreign, forest, forget, forgive, fork, form, fox, four, free, freedom, freeze, fresh, friend, friendly, from, front, fruit, full, fun, funny, furniture, further, future, game, garden, gate, general, gentleman, get, gift, give, glad, glass, go, goat, god, gold, good, goodbye, grandfather, grandmother, grass, grave, great, green, gray, ground, group, grow, gun, hair, half, hall, hammer, hand, happen, happy, hard, hat, hate, have, he, head, healthy, hear, heavy, heart, heaven, height, hello, help, hen, her, here, hers, hide, high, hill, him, his, hit, hobby, hold, hole, holiday, home, hope, horse, hospital, hot, hotel, house, how, hundred, hungry, hour, hurry, husband, hurt, ice, idea, if, important, in, increase, inside, into, introduce, invent, iron, invite, is, island, it, its, jelly, job, join, juice, jump, just, keep, key, kill, kind, king, kitchen, knee, knife, knock, know, ladder, lady, lamp, land, large, last, late, lately, laugh, lazy, lead, leaf, learn, leave, leg, left, lend, length, less, lesson, let, letter, library, lie, life, light, like, lion, lip, list, listen, little, live, lock, lonely, long, look, lose, lot, love, low, lower, luck, machine, main, make, male, man, many, map, mark, markets, marry, matter, may, me, meal, mean, measure, meat, medicine, meet, member, mention, method, middle, milk, million, mind, minute, miss, mistake, mix, model, modern, moment, money, monkey, month, moon, more, morning, most, mother, mountain, mouth, move, much, music, must, my, name, narrow, nation, nature, near, nearly, neck, need, needle, neighbor, neither, net, never, new, news, newspaper, next, nice, night, nine, no, noble, noise, none, nor, north, nose, not, nothing, notice, now, number, obey, object, ocean, of, off, offer, office, often, oil, old, on, one, only, open, opposite, or, orange, order, other, our, out, outside, over, own, page, pain, paint, pair, pan, paper, parent, park, part, partner, party, pass, past, path, pay, peace, pen, pencil, people, pepper, per, perfect, period, person, petrol, photograph, piano, pick, picture, piece, pig, pin, pink, place, plane, plant, plastic, plate, play, please, pleased, plenty, pocket, point, poison, police, polite, pool, poor, popular, position, possible, potato, pour, power, present, press, pretty, prevent, price, prince, prison, private, prize, probably, problem, produce, promise, proper, protect, provide, public, pull, punish, pupil, push, put, queen, question, quick, quiet, quite, radio, rain, rainy, raise, reach, read, ready, real, really, receive, record, red, remember, remind, remove, rent, repair, repeat, reply, report, rest, restaurant, result, return, rice, rich, ride, right, ring, rise, road, rob, rock, room, round, rubber, rude, rule, ruler, run, rush, sad, safe, sail, salt, same, sand, save, say, school, science, scissors, search, seat, second, see, seem, sell, send, sentence, serve, seven, several, sex, shade, shadow, shake, shape, share, sharp, she, sheep, sheet, shelf, shine, ship, shirt, shoe, shoot, shop, short, should, shoulder, shout, show, sick, side, signal, silence, silly, silver, similar, simple, single, since, sing, sink, sister, sit, six, size, skill, skin, skirt, sky, sleep, slip, slow, small, smell, smile, smoke, snow, so, soap, sock, soft, some, someone, something, sometimes, son, soon, sorry, sound, soup, south, space, speak, special, speed, spell, spend, spoon, sport, spread, spring, square, stamp, stand, star, start, station, stay, steal, steam, step, still, stomach, stone, stop, store, storm, story, strange, street, strong, structure, student, study, stupid, subject, substance, successful, such, sudden, sugar, suitable, summer, sun, sunny, support, sure, surprise, sweet, swim, sword, table, take, talk, tall, taste, taxi, tea, teach, team, tear, telephone, television, tell, ten, tennis, terrible, test, than, that, the, their, then, there, therefore, these, thick, thin, thing, think, third, this, though, threat, three, tidy, tie, title, to, today, toe, together, tomorrow, tonight, too, tool, tooth, top, total, touch, town, train, tram, travel, tree, trouble, true, trust, twice, try, turn, type, ugly, uncle, under, understand, unit, until, up, use, useful, usual, usually, vegetable, very, village, voice, visit, wait, wake, walk, want, warm, was, wash, waste, watch, water, way, we, weak, wear, weather, wedding, week, weight, welcome, were, well, west, wet, what, wheel, when, where, which, while, white, who, why, wide, wife, wild, will, win, wind, window, wine, winter, wire, wise, wish, with, without, woman, wonder, word, work, world, worry, yard, yell, yesterday, yet, you, young, your, zero, zoo";
  var easyWordList = easyWords.split(',');

  // const toughWords = "ability, able, about, above, accept, according, account, across, action, activity, actually, address, administration, admit, adult, affect, after, again, against, agency, agent, ago, agree, agreement, ahead, allow, almost, alone, along, already, also, although, always, American, among, amount, analysis, and, animal, another, answer, anyone, anything, appear, apply, approach, area, argue, around, arrive, article, artist, assume, attack, attention, attorney, audience, author, authority, available, avoid, away, baby, back, ball, bank, beat, beautiful, because, become, before, begin, behavior, behind, believe, benefit, best, better, between, beyond, bill, billion, black, blood, blue, board, body, book, born, both, break, bring, brother, budget, build, building, business, call, camera, campaign, cancer, candidate, capital, card, care, career, carry, case, catch, cause, cell, center, central, century, certain, certainly, chair, challenge, chance, change, character, charge, check, child, choice, choose, church, citizen, city, civil, claim, class, clear, clearly, close, coach, cold, collection, college, color, come, commercial, common, community, company, compare, computer, concern, condition, conference, congress, consider, consumer, contain, continue, control, cost, could, country, couple, course, court, cover, create, crime, cultural, culture, cup, current, customer, dark, data, daughter, dead, deal, death, debate, decade, decide, decision, deep, defense, degree, Democrat, democratic, describe, design, despite, detail, determine, develop, development, difference, different, difficult, dinner, direction, director, discover, discuss, discussion, disease, doctor, door, down, draw, dream, drive, drop, drug, during, each, early, east, easy, economic, economy, edge, education, effect, effort, eight, either, election, else, employee, energy, enjoy, enough, enter, entire, environment, environmental, especially, establish, even, evening, event, ever, every, everybody, everyone, everything, evidence, exactly, example, executive, exist, expect, experience, expert, explain, eye, face, fact, factor, fail, fall, family, far, fast, father, fear, federal, feel, feeling, field, fight, figure, fill, film, final, finally, financial, find, fine, finger, finish, fire, firm, first, fish, five, floor, fly, focus, follow, food, foot, force, foreign, forget, form, former, forward, four, free, friend, from, front, full, fund, future, game, garden, general, generation, girl, give, glass, goal, good, government, great, green, ground, group, grow, growth, guess, guy, hair, half, hand, hang, happen, happy, hard, have, head, health, hear, heart, heat, heavy, help, here, herself, high, him, himself, his, history, hold, home, hope, hospital, hot, hotel, hour, house, how, however, huge, human, hundred, husband, I, idea, identify, if, image, imagine, impact, important, improve, include, including, increase, indeed, indicate, individual, industry, information, inside, instead, institution, interest, interesting, international, interview, into, investment, involve, issue, item, it's, itself, join, just, keep, kill, kind, kitchen, know, knowledge, land, language, large, last, late, later, laugh, law, lawyer, lead, leader, learn, least, leave, left, legal, less, letter, level, life, light, like, likely, line, list, listen, little, live, local, long, look, lose, loss, love, machine, magazine, main, maintain, major, majority, make, man, manage, management, manager, many, market, marriage, material, matter, maybe, mean, measure, media, medical, meet, meeting, member, memory, mention, message, method, middle, might, military, million, mind, minute, miss, mission, model, modern, moment, money, month, more, morning, most, mother, mouth, move, movement, movie, Mr, Mrs, much, music, must, my, myself, name, nation, national, natural, nature, near, nearly, necessary, need, network, never, news, newspaper, next, nice, night, none, north, note, nothing, notice, number, occur, off, offer, office, officer, official, often, once, only, onto, open, operation, opportunity, option, order, organization, other, others, outside, over, own, owner, page, pain, painting, paper, parent, part, participant, particular, particularly, partner, party, pass, past, patient, pattern, peace, people, perform, performance, perhaps, period, person, personal, phone, physical, pick, picture, piece, place, plan, plant, play, player, PM, point, police, policy, political, politics, poor, popular, population, position, positive, possible, power, practice, prepare, present, president, pressure, pretty, prevent, price, private, probably, problem, process, produce, product, production, professional, professor, program, project, property, protect, prove, provide, public, pull, purpose, push, quality, question, quickly, quite, race, radio, raise, range, rate, rather, reach, read, ready, real, reality, realize, really, reason, receive, recent, recently, recognize, record, red, reduce, reflect, region, relate, relationship, religious, remain, remember, remove, report, represent, republican, require, research, resource, respond, response, responsibility, rest, result, return, reveal, rich, right, rise, risk, road, rock, role, room, rule, safe, same, save, scene, school, science, scientist, score, sea, season, seat, second, section, security, see, seek, seem, sell, send, senior, sense, series, serious, serve, service, set, seven, several, sex, sexual, shake, share, she, shoot, short, shot, should, shoulder, show, side, sign, significant, similar, simple, simply, since, sing, single, sister, situation, size, skill, skin, small, smile, social, society, soldier, some, somebody, someone, something, sometimes, song, soon, sort, sound, source, south, southern, space, speak, special, specific, speech, spend, sport, spring, staff, stage, stand, standard, star, start, state, statement, station, stay, step, still, stock, stop, store, story, strategy, street, strong, structure, student, study, stuff, style, subject, success, successful, such, suddenly, suffer, suggest, summer, support, sure, surface, system, table, take, talk, task, tax, teach, teacher, team, technology, television, tell, tend, term, test, than, thank, that, their, them, themselves, then, theory, there, these, they, thing, think, third, this, those, though, thought, thousand, threat, three, through, throughout, throw, thus, time, today, together, tonight, total, tough, toward, town, trade, traditional, training, travel, treat, treatment, tree, trial, trip, trouble, true, truth, try, turn, TV, type, under, understand, unit, until, usually, value, various, very, victim, view, violence, visit, voice, vote, wait, walk, wall, want, watch, water, weapon, wear, week, weight, well, west, western, what, whatever, when, where, whether, which, while, white, whole, whom, whose, wide, wife, will, wind, window, wish, with, within, without, woman, wonder, word, work, worker, world, worry, would, write, writer, incorrect, yard, yeah, year, young, your, yourself";
  // var toughWordList = toughWords.split(',');

  var wordList = easyWordList;

  var randomlyPickedWords = [];

  //pick 50 words at a time
  for(var i=0; i<50; i++){
    var randomNumber = Math.floor(Math.random() * wordList.length);
    randomlyPickedWords.push(wordList[randomNumber]+" ");
  }

  return randomlyPickedWords;
}
