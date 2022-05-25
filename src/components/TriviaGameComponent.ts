import { Component, BaseComponent, Intents } from '@jovotech/framework';

import { YesNoOutput } from '../output/YesNoOutput';

import csv from 'csv-parser';
import fs from 'fs';
let english: string[][] = []
let italian: string[][] = []
/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
|
| A component consists of handlers that respond to specific user requests
| Learn more here: www.jovo.tech/docs/components, jovo.tech/docs/handlers
|
*/
@Component()
export class TriviaGameComponent extends BaseComponent {
  START() {
    readFiles()
    return this.$send(YesNoOutput, { message: 'Hi there, welcome to Sporty Trivia, the ultimate quiz for football fans. What is your first name?' });
  }

  @Intents(['YesIntent'])
  lovesPizza() {
    return this.$send({ message: 'Yes! I love pizza, too.', listen: false });
  }

  @Intents(['NoIntent'])
  hatesPizza() {
    return this.$send({ message: `That's OK! Not everyone likes pizza.`, listen: false });
  }
  @Intents(['NewGameIntent'])
  newGame() {
    this.$send({ message: `Let\'s get started with a new game.`, listen: false });
    let errors = 0;
    let questions: number[] = [];
    let points = 0;
    while(errors < 3){
      let rand = Math.floor(Math.random() * english.length)
      while(questions.includes(rand)){
        rand = Math.floor(Math.random() * english.length)
      }
      questions.push(rand);
      let selectedQuestion: string[] = english[rand];
      let correct = selectedQuestion[1];
      let question = selectedQuestion.shift();
      selectedQuestion = selectedQuestion.sort(() => Math.random() - 0.5)
      this.$send({ message: question, true: false })
      let response = this.$input
      if(response.text == correct){
        points+=1;
      }
      else{
        errors+=1;
      }



    }
  }
  UNHANDLED() {
    return this.START();
  }
  
}
function readFiles(){
  // read english file and save it in an array of arrays
  fs.createReadStream('./src/sporty-trivia-en-games.csv')
  .pipe(csv())
  .on('data', (r) => {
    english.push(r);        
  })
  .on('end', () => {
    console.log("English Done!");
  })
  // read italian file and save it in an array of arrays
  fs.createReadStream('./src/sporty-trivia-it-games.csv')
  .pipe(csv())
  .on('data', (r) => {
    italian.push(r);        
  })
  .on('end', () => {
    console.log("Italian Done!");
  })
}