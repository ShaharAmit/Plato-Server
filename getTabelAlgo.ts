import * as firebase from '../lib/firebase.js'
import { on } from 'cluster';
import { connect } from 'net';
const fb = new firebase();
class Table {
   acceabilty = false;
   isConnectable = false;
   displayed = true;
   id: string;
   x: number;
   y: number;
   width: number;
   height: number;
   size: number;
   smoking = false;
   status = 'free';
   pLeft: number;
   pTop: number;
   pRight: number;
   pBottom: number;
}
let globalResult = [];
exports.handler =  async function(data, context) {
   let json = {busy: "'not set'",tabels : globalResult,status : "done"
   }
   let date = new Date(data.pref.fullDate);
   date.setHours(date.getHours()+3)
   //let date = new Date(zibiDate.getTime());     
   let weekDay= date.getDay();
   let promises =[];
   let tablesIds =[];
   let minusHafDate = new Date(date.getTime());
   minusHafDate.setMinutes(date.getMinutes()-30);
   minusHafDate.setHours(minusHafDate.getHours()-3)
   let plussHafDate =new Date(date.getTime());
   plussHafDate.setMinutes(date.getMinutes()+30);
   plussHafDate.setHours(plussHafDate.getHours()-3)
   let relevantTables =[]
   let notRelevantTables  = [];
   let tablesObjs  = [];
   //get all tables order for order date and time
   let size = data.pref.tableFor; 
   //Stage 1  get  all tables       
   try{
       var tableRef ;
       if(data.pref.accessibility){
            tableRef = await fb.db.collection("RestAlfa/" + data.pref.restId + "/Tables").where('acceabilty','==',true).get();
        }else{
           tableRef = await fb.db.collection("RestAlfa/" + data.pref.key + "/Tables").get()
       }
       tableRef.forEach(element => {relevantTables.push(element.data())});
       json.tabels = relevantTables
       relevantTables.forEach(table => {
           let tableOrdersRef =  fb.db.collection("RestAlfa/" + data.pref.restId + "/TablesOrders/"+ table.id+"/orders");
           let tableOrderQuery = tableOrdersRef.where("date", '>=', minusHafDate).where('date','<=',plussHafDate).get()
           promises.push(tableOrderQuery);
           tablesIds.push(table.id);
       });
       //Stage 2  get  all tables Orders that are in +- 30 min
       const tableOrderSnapshots = await Promise.all(promises);
       tableOrderSnapshots.forEach(tableOrderSnap =>{
           var index = tableOrderSnapshots.indexOf(tableOrderSnap)
           if(tableOrderSnap.empty){ console.log("tableOrderSnap is empty")}else{
               tableOrderSnap.forEach(tableOrderDoc => {
                   tablesObjs.push(tableOrderDoc.data().tableObj)
                   if(tableOrderDoc.data().status != "closed"){
                       notRelevantTables.push(relevantTables[index]);
                   }
               })
           }
       })
       // Stage 3 A update costume layput foromTableOrder
       tablesObjs.forEach(tablesObj => {relevantTables.forEach(relevantTable => {
               console.log(relevantTable)
               if(tablesObj.id == relevantTable.id){
                   var index = relevantTables.indexOf(relevantTable)
                   relevantTables[index] = tablesObj
               }
           });
       });
       //Stage 4  - remove stage 3 results from relavent tables
       notRelevantTables.forEach(notRelevant => {relevantTables.forEach(relevant => {
               if((notRelevant.id == relevant.id)){
                   var index = relevantTables.indexOf(relevant);
                   relevantTables.splice(index,1);
               }
           });
       });
       notRelevantTables = [];
       //Stage 5 seating logic
       let found = false;
       let relevntTablesForBusy = [];
       let busyHourStart = "";
       let busyHourEnd = "";
       //Stage 5.1  check for busy
       const  workingDayDoc = await fb.db.doc("RestAlfa/" + data.pref.restId + "/WorkingDays/" + weekDay).get();
       if(workingDayDoc.exists){
           if(workingDayDoc.data().isBusy){
               busyHourStart = workingDayDoc.data().busyHourStart
               busyHourEnd = workingDayDoc.data().busyHourEnd
               var tempArr = busyHourStart.split(":")
               let startTime = new Date(date.getTime());
               startTime.setHours(parseInt(tempArr[0]));
               startTime.setMinutes(parseInt(tempArr[1]));
               var tempArr2 = busyHourEnd.split(":")
               let endTime = new Date(date.getTime());
               endTime.setHours(parseInt(tempArr2[0]));
               endTime.setMinutes(parseInt(tempArr2[1]));
               //Stage 5.2 try to finde exact table size
               try{
                   if(startTime <= date && date <= endTime){
                       for(var i = 0 ; i<3; i++){
                          let tableFor = parseInt(data.pref.tableFor) 
                          var fitTablesArray = []
                           //copy tables
                           relevantTables.forEach(element => {
                               relevntTablesForBusy.push(element);
                           });
                           for (const table of relevntTablesForBusy) {
                               if(table.size != data.pref.tableFor+i){
                                   notRelevantTables.push(table);
                               }else{
                                   fitTablesArray.push(table)
                               }
                            }
                            notRelevantTables.forEach(notRelevant => {
                               relevntTablesForBusy.forEach(relevant => {
                                   if(notRelevant.id == relevant.id){
                                       var index = relevntTablesForBusy.indexOf(relevant);
                                       relevntTablesForBusy.splice(index,1);
                                   }
                               });
                           });
                           if(fitTablesArray.length>0){
                               relevntTablesForBusy = fitTablesArray
                               found = true;
                               break;
                           }
                       }
                       //Stage 5.3  end of Loop
                       if(found){
                           found = false;   
                           const obj = { busy: "'busy'", status: "'found in busy'",tabels : relevntTablesForBusy }
                           return obj
                       }else{
                           let arr = await combineTables(relevantTables,data.restId);
                           relevntTablesForBusy = globalResult
                           if(relevantTables.length > 0){
                               const obj = { busy: "'marge'", status: "'found in busy marge'", tabels : relevntTablesForBusy}
                               return obj
                           }else{
                               const obj = {busy: "'busy'", status: "'not found tables at marge mode'", tabels : relevntTablesForBusy}
                               return obj
                           }
                       }
                   }
               }catch(error){
                   console.log("errror: " + error);
               }
           }else{
               const obj = {busy: "'not busy'",status: "'notBusy'",tabels : relevantTables}
               return obj
           }
       }else{
           const obj = {busy: "'not busy'",status: "'no working days'", tabels : relevantTables}
           return obj
       }
   }catch(err){
       console.log(err)
       json.status ="'catche  : "+ err + "'"
       return json
   }
   json.status ="'functions exit try'"
   return json 
}
function combineTables(tablesArr,restId) {
   let  flag = false
   if(!flag){
       tablesArr.forEach(table => {
           if(table.isConnectable){
               let connectedAble = table.connectedTo
               if(Object.keys(connectedAble).length>0){
                   let objKey = Object.keys(connectedAble)[0];
                   let tableId = objKey.substring(5,objKey.length);
                   var connectFlag = connectedAble[Object.keys(connectedAble)[0]];
                   if(!connectFlag){
                       //found conected
                       console.log("table id :" + tableId)
                       if(containeTable(tablesArr,tableId)){
                           console.log("found - "+ tableId)
                           //chack also its allredy conected if so
                           let tableCanidate = findTable(tablesArr,tableId);
                           console.log("tableCanidate:")
                           if(tableCanidate.id != table.id){
                                   if(!(tableCanidate.connectedNow)){
                                       let data = {
                                           restId : restId,
                                           movedTable : tableCanidate,
                                           connectedToTable : table
                                       }
                                      let newTableObj =  handler(data,"1231")                                     
                                      newTableObj.connectedTo["table"+tableCanidate.id] = true;
                                      newTableObj.connectedNow = true;
                                    //new Table is
                                      console.log(newTableObj)
                                      for(let t = 0 ;t<tablesArr.length;t++){
                                          if(tablesArr[t].id == tableCanidate.id){
                                               tablesArr[t].displayed = false;
                                               tablesArr[t].connectedNow = true;                                             
                                             tablesArr[t].connectedTo["table"+newTableObj.id] = true;
                                          }
                                      }
                                   //end
                                      let index = tablesArr.indexOf(table)
                                       tablesArr[index] = newTableObj
                                       flag = true;
                                       globalResult = tablesArr
                                   }
                           }
                       }
                   }
               }
           } 
       });
   }
   else{
       return tablesArr
   }
}
function handler (data, context) {
   const restId = data.restId;
   const movedTable = data.movedTable;
   const connectedToTable = data.connectedToTable;
   const mergedRect = getMergedRectangle(connectedToTable, movedTable);
   const mergedTable: any = {};
   mergedTable.id = connectedToTable.id;
   mergedTable.x = mergedRect.x;
   mergedTable.y = mergedRect.y;
   mergedTable.width = mergedRect.width;
   mergedTable.height = mergedRect.height;
   mergedTable.size = mergedTable.width * mergedTable.height * 2;
   mergedTable.smoking = movedTable.smoking && connectedToTable.smoking;
   mergedTable.acceabilty = movedTable.acceabilty;
   mergedTable.isConnectable = false;
   mergedTable.pTop = mergedTable.y;
   mergedTable.pLeft = mergedTable.x;
   mergedTable.pRight = mergedTable.x + mergedTable.width;
   mergedTable.pBottom = mergedTable.y + mergedTable.height;
   mergedTable.displayed = true;
   mergedTable.connectedTo = {};
   mergedTable.status = "free";
   mergedTable.connectedTo =  connectedToTable.connectedTo;
   mergedTable.connectedNow = true;
   return mergedTable;
};
function getMergedRectangle(connectedToTable, movedTable): any {
   if (connectedToTable.width === movedTable.width) {
       const x = connectedToTable.x;
       const y = connectedToTable.y;
       const width = connectedToTable.width;
       const height = connectedToTable.height + movedTable.height;
       return {x, y, width, height};
   } else if (connectedToTable.height === movedTable.height) {
       const x = connectedToTable.x;
       const y = connectedToTable.y;
       const height = connectedToTable.height;
       const width = connectedToTable.width + movedTable.width;
       return {x, y, width, height};
   }
   return null;
}
function containeTable(arr,tableId) {
   var res = false;
   for (let element of arr) {
       if(element.id == tableId){
           res = true;
           break;
       }
   }
   return res
}
function findTable(arr,tableId) {
   var res =  tableId;
   for (let element of arr) {
       if(element.id == tableId){
           res = element;
           break;
       }
   }
   return res
}
