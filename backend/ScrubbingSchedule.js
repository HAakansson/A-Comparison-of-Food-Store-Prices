const Harvesting = require('./Harvesting')
const fs = require('fs');
module.exports = class ScrubbingSchedule{

 static startTimer(){
    setTimeout(() => {
      this.checkIfHarvestingIsNeeded();
    },60000);
  }
 static async startHarvesting(){
   this.writeToFile(new Date());
    await Harvesting.go();
    this.startTimer();

  }

 static checkIfHarvestingIsNeeded(){
    let lastScan;
    
    try{
      lastScan = fs.readFileSync('timestamp.json', 'utf-8')
    }
    catch(error){
      console.log(error);
    }
   lastScan = new Date(JSON.parse(lastScan));
   let date = new Date();

if(date.getHours() === 3 && lastScan.getDate() !== date.getDate()){
this.startHarvesting();
}
else if(lastScan.getTime() + 86400000 < date.getTime()){
  this.startHarvesting()
}
else{
  this.startTimer();
}
}

  static writeToFile(time){
    fs.writeFileSync('timestamp.json', JSON.stringify(time, null, '  '), 'utf-8');
  }

  static go() {
    this.startTimer();
  }

}