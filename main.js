"use strict";
function addRow(tableID){
    let objectTable= document.getElementById(tableID);
    let newRow = objectTable.insertRow(-1)
    let indexRow = newRow.rowIndex
    let td1 = newRow.insertCell(0);
    let td2 = newRow.insertCell(1);
    let td3 = newRow.insertCell(2);
    td1.innerHTML = `<input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Начните вводить именование объекта" style="width: 400px;">
            <datalist id="datalistOptions">
            <option value='JMS Profile'>
            <option value='Data Map'>
            <option value='Pers.Applets'>
            <option value='Pers.Rules'>
            <option value='Pers.Views'>
            <option value='RTE'>
            <option value='Pers.Actions'>
            <option value='DVM'>
            <option value='EAI Lookup Map'>
            <option value='EAI Data Map'>
            <option value='Navigation Links'>
            <option value='Comm Pkg'>
            <option value='Inb.WS'>
            <option value='Out.WS'>
            <option value='DataMap'>
            <option value='Log Conf.'>
            <option value='Audit Trail'>
            <option value='Wf Action Type'>
            <option value='Wf Policy'>
            <option value='АДМ - представление'>
            <option value='Responsibility'>
            <option value='SysPref'>
            <option value='PDQ'>
            <option value='LOV'>
            <option value='LOV Constant'>
            <option value='ATC EFS'>
            <option value='EFS Profile'>
            <option value='Конфигурация телефонии'>
            <option value='DV'>
            <option value='SmartScript'>
            <option value='Task Resp.'>
            <option value='Link'>
            <option value='BC'>
            <option value='WF'>
            <option value='IO'>
            <option value='Applet'>
            <option value='BO'>
            <option value='Screen'>
            <option value='Pick List'>
            <option value='SS'>
            <option value='Web Template'>
            <option value='BS'>
            <option value='Icon Map'>
            <option value='View'>
            <option value='Bitmap Category'>
            <option value='Task'>
            <option value='Table'>
            <option value='WFP Column'>
            <option value='WFP Program'>
            <option value='WFP Object'>
            <option value='JS'>
            <option value='CSS'>
            <option value='HTML'>
            <option value='images'>
            <option value='srvmgr'>
            <option value='sql'>
            </datalist>`
    td2.innerHTML = `<textarea class="form-control" aria-label="С текстовым полем"  placeholder="Введите названия объектов через запятую" style="width: 1000px;">`
    td3.innerHTML = `<button id = '`+indexRow+`'type="button" class="btn btn-dark" onclick = deleteRowIndex(this.id)>Удалить строку</button>`
}

function deleteRowIndex(index) {
  document.getElementById('tObj').deleteRow(index)
}   

function createWaterMark(){
  let markS = document.getElementById('markS').value
  let dataInt = document.getElementById('dataInt').value
  let reg = /\d\d\d\d-\d\d-\d\d/g;
  markS = markS.replace(reg, dataInt)
  console.log(markS)
  document.getElementById("markEx").value = markS;
}

function createTaskList(task, ver_patch){ //создаем sql апдейт тасков
  let regVerTask = /\d{1,}/g
  let regNameTask = /\w{1,}\s{0,}\w{0,}\s{0,}\w{0,}\s{0,}\w{0,}\s{0,}\w{0,}\s{0,}\w{0,}\(/g
  let regexp = /^\s+|\s{1,}\(/g
  let result = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Создать sql файл " + ver_patch + "\\db\\TASKS со следующим текстом: <br><mark><code>update SIEBEL.s_tu_task set status_cd='NOT_IN_USE' where status_cd='COMPLETED';<br>  commit;</mark></code><br>  -----------------------------------------------";
  let ver = "";
  let name = "";
  for (let i = 0; i < task.length; i++) {
    const element = task[i];
    ver = element.match(regVerTask)
    name = element.match(regNameTask)
    name = name[0]
    name = name.replace(regexp)
    result += "<br><mark><code>update SIEBEL.s_tu_task set status_cd='COMPLETED' where task_name='" + name + "' and version='" + ver + "';<br>    commit;</mark></code>"
  }
  return result
}
function createDate(type){
  //Общие переменные
  let fullRRFlg = document.getElementById('fullRRFlg').checked    //Фул репозиторий? 
  let ver = document.getElementById('ver').value;                 //Версия патча/релиза
  let int = document.getElementById('int').value;                 //Текущий инт
  let div = document.querySelector('div')                         //див
  let ol = document.getElementById('proList')                     //нумированый список
  let manu_fil = document.getElementById('manu_fil')              //инструкция по сборке для филит
  let manu_bank =  document.getElementById('manu_bank')           //инструкция по сборке для банка
  let listOftd = null;                                            //
  let listName = [];                                              //список объектов
  let sNameOb = null;                                             //Название объекта
  let sName = null;                                               //Именование объектов
  let repFileName = document.getElementById('repFileName').value; //название файла репозитория
  let DDLFileName = document.getElementById('DDLFileName').value; //название файла схемы
  let tasks = [];
  let DV = [];
  let serverFlg = 'N';
  let ADMFlg = 'N';
  let trigFlg = 'N';
  let cashApp = 'N';
  let cashMap = 'N';
  let cashLov = 'N';
  let cashEvent = 'N';
  //Для инструкций
  let arr = []; //данные из функции
  //Нерепозиторка АДМ
  let sql = document.createElement('li'); //sql для апдейта нерепозиторных
  let sqlFlag = "N";
  let dateOutPr = document.createElement('li'); //добавление в проект внедрения
  let prFlag = "N";
  //DV доп
  let dateOutDV = document.createElement('li'); //экспорт DV
  let DVFlag = "N";
  //Конфигцрация телефонии  доп
  let dateOutConf = document.createElement('li');
  let confFlag = "N";
  //EFS доп
  // let dateOutEFS = document.createElement('li');
  // let EFSFlag = "N"
  //Экспорт sql скриптов
  let dateSQLScr = document.createElement('li');
  let sqlScrFlag = "N";
  //Экспорт файлов
  let dateOutFile = document.createElement('li');
  let fileFlag = "N";
  //Создание папок
  let createFolder = document.createElement('li');
  let folderReg = /\./g
  
  let listOftr = Array.from(document.getElementById('tObj').querySelectorAll('tr'))
  listOftr = listOftr.slice(1)

  function createListBuild() {
    if(div) {div.remove()};
    div = document.createElement('div');
    if(ol) {ol.remove()};
    ol = document.createElement('ol');
    ol.setAttribute('id','proList');
    createFolder.innerHTML = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Необходимо создать папки <br> На локальной машине как вам удобно или " + ver + ".<br> На dev по пути \\10.125.8.59\\d$\\ses в вашей папке " + ver.replace(folderReg,'_') + ". <br> На стенде по пути \\172.19.2.12\c$\PRFL с именем " + ver + "."
    //Экспорт репозитория
    let exportRep = document.createElement('li');
    if(fullRRFlg) {
      exportRep.innerHTML = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Для экспорта репозитория и схемы заходим в Migration под Sadmin. Далее заходим в Migration Plans, выбираем редактировать RR Full Export. В октрывшимся окне, внизу убираем галочку Application Workspace Data Service, и опять ее ставим. В открывшимся окне вбыираем нужный нам int. Далее слева заходим в Execution и нажимаем плей RR Full Export . После экспорта появится файл по пути \\10.125.8.59\\d$\\sfs\\migration\\ . Файл типо ddlexport_3A063EA767DE.ctl Сохраняем его в патче в папке scheme, а файл типо repexport_3A07919A9EF6 в папку repository'
    } else {
      exportRep.innerHTML = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Для экспорта репозитория заходим на dev, в командной строке вбиваем следующую команду: <br><mark><code> C:\\ses\\siebsrvr\\BIN\\repimexp.exe /l c:\\dkolcheganova_temp_box\\Repositories\\' + ver.replace(folderReg,'_') + '\\repexport_' + ver.replace(folderReg,'_') + '.log /p SADMIN /d SIEBEL /Y "' + document.getElementById('markEx').value + '"  /r "Siebel Repository" /f c:\\dkolcheganova_temp_box\\Repositories\\'  + ver.replace(folderReg,'_') +  '\\repexport_'  + ver.replace(folderReg,'_') +  '.dat /c SBLTST_DSN /A O /u SADMIN </mark></code><br> Можно переименовать полученный файл, и переместить его в патч в папку repository'
    }
    
    //Экспорт схемы
    let exportShem = document.createElement('li');
    if(!fullRRFlg) {
      exportShem.innerHTML = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Для экспорта схемы заходим в Migration под Sadmin, далее Execution и нажимаем плей Scheme Export. После экспорта появится файл по пути \\10.125.8.59\\d$\\sfs\\migration\\ . Файл типо ddlexport_3A063EA767DE.ctl Сохраняем его в патче в папке scheme'
    }
    
    //Экспорт других sql скриптов
    let dateSQLMain = document.createElement('li');
    dateSQLMain.innerHTML = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Сборка постоянных скриптов: <br>Release - указываем тут какой патч/релиз устанавливается<br>MANIFESTS - отключаем ненужные манифесты(очень аккуратно, иногда это необходимо делать поименно) ОЧЕНЬ ВАЖНО - ДЕЛАТЬ ВНИМАТЕЛЬНО!"
    //Экспорт PKG
    let datePKG = document.createElement('li');
    let datePKGFlag = "N";
  
    //экспорт тасков
    let dateTask = document.createElement('li');
    let dateTaskFlag = "N"

    //Экспорт JMS
    let dateJMS = document.createElement('li');
    let dateJMSFlag = "N";
    function createUpdateRTE(list, regexp) { 
      let a = '';
      for (let i = 0; i < list.length; i++) {
        let element = list[i];
        element = element.split("-");
        element = element.map(item=>item.replace(regexp,""))
        a += "<mark><code>update siebel.S_CT_EVENT a set a.X_RELEASE = '" + ver + "' where a.OBJ_TYPE_CD = '" + element[0] + "' AND a.OBJ_NAME = '" + element[1] + "' AND a.EVT_SUB_NAME = '" + element[2] + "' AND a.EVT_NAME = '" + element[3] + "';<br>commit;</mark></code><br>"   
      }
      return a;
    }
    function createListOfNoRepOut(obj, list, ver, int, regexp, arr){  //формирование данных для НЕРЕПОЗИТОРНЫХ
      function OneObj(name) {
          this.name = name;             //режим внедрения
          this.admName = '';            //название объекта в АДМ
          this.seachSpec = '';          //фильтр
          this.wayOp = '';              //режим внедрения
          this.tableOb = '';            //таблица в которой храняться объекты
          this.fildBase = '';           //колонка по которому ищем объекты
          this.fildRel = "X_RELEASE";   //релиз
          this.sql_f = '';              //sql
          this.dateOutDV_f = "";        // экспорт DV
          this.dateOutConf_f ="";       //экспорт конфигурации
          this.dateOutEFS_f = "";       //экспорт файловой системы
          this.dateOutsqlScr_f = "";    //экспорт sql скриптов
          this.dateOutFile_f = "";      //экспорт файлов
          this.dateOutPKG_f = "";       //экспорт пакетов
          this.fildBase = "";           //поле для поиска
          this.dateJMS = "";            //экспорт JMS профилей
          this.sqlTask = "";            //написание файла для активации тасков
  
      };
      let listSQL = "'" + list.join("','") + "'"
      let listOr = list.join(" OR ")
      let objOut = new OneObj('Nope');
      arr = [];
      switch(obj) {
        case 'Pers.Applets':
          objOut.name = "ADM"
          objOut.admName = "Personalization - Applets";
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_CT_APPLET";
          objOut.fildBase = "APPLET_NAME";
          break;
        case 'Pers.Rules':
          objOut.name = "ADM"
          objOut.admName = "Personalization - Rules"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_CT_RULE_SET";
          objOut.fildBase = "NAME";
          break;
        case 'Pers.Views':
          objOut.name = "ADM"
          objOut.admName = "Personalization – Views"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_APP_VIEW";
          objOut.fildBase = "NAME";
          break;
        case 'RTE': 
          objOut.name = "ADM"
          objOut.admName = "Personalization – Events"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.sql_f = "--RTE<br>"
          objOut.sql_f += createUpdateRTE(list, regexp)
          break;
        case 'Pers.Actions':
          objOut.name = "ADM"
          objOut.admName = "Personalization - Actions"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_CT_ACTION_SET";
          objOut.fildBase = "NAME";
          break;
        case 'DVM':
          objOut.name = "ADM"
          objOut.admName = "ATC ADM Data Validation Message"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_ISS_VALDN_MSG";
          objOut.fildBase = "MSG_TYPE_CD";
          break;
        case 'EAI Lookup Map'://Тут есть примеры и вставить так и синхрон
          objOut.name = "ADM"  
          objOut.admName = "ATC ADM EAI Lookup Map"
          objOut.sql_f = list.map(item=>"[Type] = '" + item + "'");
          listOr = objOut.sql_f.join(" OR ")
          objOut.seachSpec = "(" + listOr + ") AND [ATC Release]='" + ver + "'"
          objOut.wayOp = "Вставить"
          objOut.tableOb = "S_EAI_LOOKUPMAP";
          objOut.fildBase = "LOOKUP_TYPE";
          break;
        case 'EAI Data Map':
          objOut.name = "ADM"
          objOut.admName = "EAI Data Map"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_INT_OBJMAP";
          objOut.fildBase = "NAME";
          break;
        case 'Comm Pkg':
          objOut.name = "ADM"
          objOut.admName = "ADM Comm Package"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_DMND_CRTN_PRG";
          objOut.fildBase = "NAME";
          break;
        case 'Inb.WS':
          objOut.name = "ADM"
          objOut.admName = "Web Service - Inbound"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize" 
          objOut.tableOb = "S_WS_WEBSERVICE";
          objOut.fildBase = "NAME";
          break;
        case 'Out.WS':
          objOut.name = "ADM"
          objOut.admName = "Web Service - Outbound"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_WS_WEBSERVICE";
          objOut.fildBase = "NAME";
          break;
        case 'Data Map':
        case 'DTU': 
          objOut.name = "ADM"
          objOut.admName = "DataMapObject"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_BUSOBJ_DMAP";
          objOut.fildBase = "NAME";
          break;
        case 'Log Conf.':
          objOut.name = "ADM"
          objOut.admName = "ATC Log Configuration"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "CX_LOG_CONFIG";
          objOut.fildBase = "NAME";
          break;
        case 'Audit Trail':
          objOut.name = "ADM"
          objOut.admName = "Audit Trail Admin"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_AUDIT_BUSCOMP";
          objOut.fildBase = "BUSCOMP_NAME";
          break;
        case 'Wf Action Type':
          objOut.name = "ADM"
          objOut.admName = "Workflow Action Type"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_ACTION_DEFN";
          objOut.fildBase = "ROW_ID"; //УТОЧНИТЬ!
          break;
        case 'Wf Policy':
          objOut.name = "ADM"
          objOut.admName = "Workflow Policy"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_ESCL_RULE";
          objOut.fildBase = "NAME"; //УТОЧНИТЬ!
          break;
        case 'АДМ - представление': //УТОЧНИТЬ!
          objOut.name = "ADM"
          objOut.admName = "View"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_APP_VIEW";
          objOut.fildBase = "NAME"; 
          break;
        case 'Responsibility': 
          objOut.name = "ADM"
          objOut.admName = "Responsibility"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_RESP";
          objOut.fildBase = "NAME"; 
          break;
        case 'SysPref': 
          objOut.name = "ADM"
          objOut.admName = "ATC System Preferences"
          objOut.seachSpec = "[Name] in (" + listSQL + ")"
          objOut.wayOp = "Синхронизация/Synchronize"
          tableOb = "S_SYS_PREF";
          objOut.fildBase = "SYS_PREF_CD"; 
          break;
        case 'Navigation Links': 
          objOut.name = "ADM"
          objOut.admName = "ATC ADM Navigation Links"
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_NAV_LINK";
          objOut.fildBase = "NAME"; 
          break;
        case 'PDQ': 
          objOut.name = "ADM"
          objOut.admName = "PDQ "
          objOut.seachSpec = "[ATC Release]='" + ver + "'"
          objOut.wayOp = "Синхронизация/Synchronize"
          objOut.tableOb = "S_APP_QUERY";
          objOut.fildBase = "SYS_PREF_CD"; 
          break;
        case 'LOV': 
          objOut.name = "ADM"
          objOut.admName = "LOV"
          objOut.seachSpec = "[ATC Release]='" + ver + "' AND [Name]<>'ATC_CONSTANT'"
          objOut.wayOp = "Вставить"
          objOut.tableOb = "S_LST_OF_VAL";
          objOut.fildBase = "VAL"; 
          break;
        case 'LOV Constant': 
          objOut.name = "ADM"
          objOut.admName = "LOV"
          objOut.seachSpec = "[List Of Values Parent (UDA).Value] = 'ATC_CONSTANT' AND [List Of Values Child (UDA).Type] = 'ATC_CONSTANT' AND [List Of Values Child (UDA).ATC Release] = '" + ver + "'"
          objOut.wayOp = "Вставить"
          objOut.tableOb = "S_LST_OF_VAL";
          objOut.fildBase = "NAME"; 
          break;
        case 'DV': 
          objOut.dateOutDV_f = "<br><b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br><b>DV</b><br>Зайти на экран Наборы правил. Сделать поиск, где Имя <mark><code>" + listOr + ",</mark></code> а Статус - <b>Активно</b>. Необходимо проверить, что нет пересечений с новым релизом. Шестеренка - > экспорт. Полученный файл переместить в папку DV"
          DV = list;
          break;
        case 'Конфигурация телефонии':
          objOut.dateOutConf_f = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Зайти на страницу <b>АДМ – коммуникации, Конфигурации</b>. Найти конфигурацию по имени <mark><code>" + listOr + "</mark></code>. Шестеренка - > экспорт. При экспорте выбираем первые 3 параметра (Параметры конфигурации, Команды, События). Полученный файл переместить в папку Конфигурация"
          break;
        case 'ATC EFS':
          objOut.wayOp = 'Upsert';
          objOut.admName = 'ATC EFS ADM';
          objOut.sql_f = list.map(item=>"[ATC EFS Container.Code] = '" + item + "'");
          listOr = objOut.sql_f.join(" OR ")
          objOut.seachSpec = "[ATC EFS Profile.Code] = 'HCP' AND (" + listOr + ")"
          break;
        case 'sql':
          objOut.dateOutsqlScr_f = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Необходимо все скрипты sql добавить в патч в файл SIEBEL, в папку \\db , а так же к каждому коду написать номер тикета через --'
          break;
        case 'JS':
        case 'images':
        case 'srvmgr':
        case 'HTML':
        case 'CSS':
          objOut.dateOutFile_f = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Необходимо все файлы добавить в патч в папку \\server , сохраняя при этом путь (пример server\\ses\\applicationcontainer_external\\siebelwebroot\\scripts\\siebel)'
          break;
        case 'PKG':
          objOut.dateOutPKG_f = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Необходимо добавить файл PKG в папку \\db , а так же проверить, что между объявлением ВЬЮ и БОДИ пакета есть символ \\'
          break;
        case 'Task':
          tasks = list;
          objOut.sqlTask =  createTaskList(list, ver);
          break;
        case 'JMS Profile':
          objOut.dateJMS  = '<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Добавить JMS-скрипты в папку \\srvmgr'
        }
      if(objOut.tableOb){
          objOut.sql_f = "--" + obj + "<br><mark><code> update siebel." + objOut.tableOb + " a set a." + objOut.fildRel + " = '" + ver + "' where a." + objOut.fildBase + " in (" + listSQL + ")"//");<br> commit;</mark></code><br>"
      if(objOut.admName == "LOV" || objOut.admName == "LOV Constant"){
          objOut.sql_f += " and a.ws_id = (select s.row_id from S_WORKSPACE s where s.Name = '" + int + "');<br> commit;</mark></code><br>"
        }
        else {
          objOut.sql_f += ";<br> commit;</mark></code><br>"
        }
      }
      if(objOut.admName){
          objOut.dateOutPr_f = "<i>" + obj + "</i>. Имя типа данных:<b> " + objOut.admName + ",</b> Режим внедрения <b>" + objOut.wayOp + "</b>, Фильтр для развертывания <mark><code>" + objOut.seachSpec + "</mark></code>.<br>"
      }
      if(objOut.admName == "ATC EFS ADM"){
        list = list.map(item=>"[Table Name] = '" + item + "'")
        listOr = list.join(" OR ")
        objOut.dateOutPr_f += "Необходимо раскрыть Имя типа данных (всего 3 ступени) и проверить/изменить <i>Фильтр</i>. Для ATC EFS Manage Profile ADM =<mark><code>" + listOr +"</code></mark>, а ATC EFS Profile ADM = <mark><code>[ATC EFS Profile.Code] = 'HCP' AND (" + listOr + ")  AND [ATC EFS Profile Params.Name] IS NULL AND [ATC EFS Container Params.Name] IS NULL AND [ATC EFS Container Meta.Name] IS NULL</mark></code><br>";
        objOut.sql_f = ""
      }
  
      //ol.appendChild(li);
      //li.innerHTML=li.innerHTML + b; //добавляет li
      //arr = [sql_f, dateOutPr_f, dateOutDV_f,dateOutConf_f,dateOutsqlScr_f,dateOutFile_f, dateOutPKG_f]
      return objOut;
    }
    sql.innerHTML = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Прогнать на DEV следующие апдейты: <br>"
    dateOutPr.innerHTML = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br>Зайти на страницу Проекты для внедрения, создать проект с именем " + ver + ". Поставить флаг в колонке Экспорт в файл. <br>На нижнем апплете создать следующие записи<br>"
    let disRep = document.createElement('li');
    disRep.innerHTML = "<b>ГОТОВО</b> <input style: width: 40px; type=\"checkbox\"><br><b>Дизайн после санити</b><p>После того, как санити будет успешным, необходимо на локальной машине в cmd прогнать скрипт:<br><mark><code> C:\\Tools_2\\BIN\\dataexp /u SADMIN /p SADMIN /c \"SSD default instance\" /d SIEBEL /f C:\\Tools_2\\BIN\\Lov" + int + ".dat /l C:\\Tools_2\\BIN\\" + int + " /w y /a IntWSName=" + int + "</mark></code><br>Из папке на деве \\\\10.125.8.59\\d$\\repos_backup забрать последний ночной бекап (большой файл).<br>Полученные 2 файла закинуть в полную сборку, в папку Full Repository(НЕ ДЛЯ ПРОДА)"

    document.getElementById('renderList').appendChild(ol);
    for (let i = 0; i < listOftr.length; i++) { // 
      let element = listOftr[i];
      listOftd = Array.from(element.querySelectorAll('td'))
      sNameOb = listOftd[0].querySelectorAll('input')[0].value
      if (!sNameOb) continue;
      div.innerHTML += "<b> " + sNameOb + "</b>"
      sName = listOftd[1].querySelectorAll('textarea')[0].value
      sName = sName.split(',')
      let regexp = /^\s+|\s+$/g
      sName = sName.map(item=>item.replace(regexp,""))
      console.log(sName)
      listName = [];
      for (let j = 0; j < sName.length; j++) { // Тут название самих объектов
        const element = sName[j];
        div.innerHTML += "<li style = 'margin-left: 40px;'>" + element + "</li>"
        listName.push(element);
      }
      arr = createListOfNoRepOut(sNameOb, listName, ver, int, regexp);
      console.log(arr)
      if(arr.dateJMS != ""){
        dateJMS.innerHTML = dateJMS.innerHTML + arr.dateJMS;
        dateJMSFlag = "Y"
      }
      if(arr.sql_f != "") {
        sql.innerHTML = sql.innerHTML + arr.sql_f
        sqlFlag = "Y"
      }
      if(arr.dateOutPr_f){
        dateOutPr.innerHTML = dateOutPr.innerHTML + arr.dateOutPr_f
        prFlag = "Y"
      }
      if(arr.dateOutDV_f){
        dateOutDV.innerHTML = dateOutDV.innerHTML + arr.dateOutDV_f
        DVFlag = "Y"
      }
      if(arr.dateOutConf_f){
        dateOutConf.innerHTML = dateOutConf.innerHTML + arr.dateOutConf_f
        confFlag = "Y"
      }
      if(arr.dateOutsqlScr_f){
        dateSQLScr.innerHTML = dateSQLScr.innerHTML + arr.dateOutsqlScr_f
        sqlScrFlag = "Y"
      }
      if(arr.dateOutFile_f && fileFlag == "N"){
        dateOutFile.innerHTML = dateOutFile.innerHTML + arr.dateOutFile_f
        fileFlag = "Y"
      }
      if(arr.dateOutPKG_f){
        datePKG.innerHTML = datePKG.innerHTML + arr.dateOutPKG_f
        datePKGFlag = "Y"
      }
      if(arr.sqlTask){
        dateTask.innerHTML =  arr.sqlTask
        dateTaskFlag = "Y"
      }
      
    }
    dateOutPr.innerHTML = dateOutPr.innerHTML + "Падая по линку типа данных, проверяем, что все есть по списку объектов. Если все ОК, то нажимаем кнопку Разрешить. <br>Переходим на соседнюю вкладку Сеансы внедрения. Cоздаем сеанс. Выбираем созданный проект. Нажимаем Внедрить. Данные необходимо сохранять по пути  'D:\\ses\\siebsrvr\\TEMP'. Полученные файлы (без _des), сохраняем в патч, в папку ADM. Файл, где только айди, переименовываем по типу X-XX (например 1-04 для патча xx.x.4)>"
  
    //Последоватеьлность
    ol.prepend()
    ol.prepend(disRep)
    ol.prepend(dateSQLMain)
    if(datePKGFlag == "Y"){ol.prepend(datePKG)}
    if(sqlScrFlag == "Y") {ol.prepend(dateSQLScr)}
    if(dateJMSFlag == "Y"){ol.prepend(dateJMS)}
    if(fileFlag == "Y"){ol.prepend(dateOutFile)}
    if(confFlag == "Y"){ol.prepend(dateOutConf)}
    if(DVFlag == "Y"){ol.prepend(dateOutDV)}
    if(prFlag == "Y"){ol.prepend(dateOutPr)}
    if(dateTaskFlag == "Y"){ol.prepend(dateTask)}
    if(sqlFlag == "Y"){ol.prepend(sql)}
    ol.prepend(exportRep)
    if(!fullRRFlg){ol.prepend(exportShem)}
    ol.prepend(createFolder)
    
    document.getElementById('renderListOfObj').appendChild(div);
    
  }

  function createManual(){
    if(manu_fil) {manu_fil.remove()}
    if(manu_bank) {manu_bank.remove()}
    console.log('createManual')
    let maunu_obj = {
      stepEAI:"Перезапустить EAI компоненту на всех Siebel App",
      stepDiccache:"Удалить файл diccache.dat в папке C:\\ses\\siebsrvr\\BIN",
      stepRelease:"Выполнить Release.sql папки поставки /db/ в схеме SIEBEL",
      stepCash:"В приложении FINS перейти на экран",
      stepTrig:"Выполнить перегенерацию триггеров через srvmgr:<p><p style=\"margin-left: 50px;\">run task for comp GenTrig server app with EXEC=True,Mode=WORK,Remove=True,PrivUser=SIEBEL,PrivUserPass=SIEBEL<p><p style=\"margin-left: 50px;\">run task for comp GenTrig server app with EXEC=True,Mode=WORK,Remove=False,PrivUser=SIEBEL,PrivUserPass=SIEBEL",
      stepTaskActive:"В приложении FINS перейти в \"Администрирование - бизнес-процесс -> Внедрение задачи\" найти Task и активировать:",
      stepSIEBEL:"Выполнить скрипт в схеме SIEBEL из папки поставки /db/SIEBEL.sql",
      stepDV:"Произвести импорт правил Data Validation из папки поставки /DV/. После чего активизировать импортированные Data Validation",
      stepEFS:"Проверить настроки файловой системы для таблицы",
      stepADMRun:"Выполнить импорт АДМ через srvmgr. Выполнить команды:<p><p style=\"margin-left: 50px;\">run task for comp WfProcMgr server app with ProcessName=\"ATC Import ADM\", RowId=\"1-02\"<p><p style=\"margin-left: 50px;\">После выполнения комманды - верифицировать успешный импорт через таблицу SIEBEL.CX_LOG!",
      stepADMFile:"Скопировать содержимое папки поставки /ADM/ в папку на сервере C:/ADM/", 
      stepTask:"Выполнить скрипт в схеме SIEBEL /db/TASKS.sql",
      stepManifest:"Выполнить скрипт в схеме SIEBEL из папки поставки /db/MANIFESTS.sql",
      stepSercFile:"Произвести замену файлов сервера на файлы из папки поставки /server/ (пути до файлов внутри корневой папки соответствуют путям на сервере)",
      repFileBNK:"Выполнить команду в cmd консоли с правами администратора: <p><p style=\"margin-left: 50px;\">C:\\ses\\siebsrvr\\BIN\\repimexp.exe /u SADMIN /p <Пароль SADMIN> /l <Путь до поставки>\\" + ver + "\\repository\\" + repFileName + ".log /f <Путь до поставки>\\" + ver + "\\repository\\" + repFileName + ".dat /A P /d SIEBEL /r \"Siebel Repository\" /c <Актуальный ODBC стенда><p>",
      stepSchemeBNK:"По окончанию выполнить сгенерированный файл <Путь до поставки>\\" + ver + "\\scheme\\" + DDLFileName + ".sql",
      DDLFileBNK:"Выполнить команду в cmd консоли с правами администратора: <p><p style=\"margin-left: 50px;\">C:\\ses\\siebsrvr\\BIN\\ddlimp.exe /u SIEBEL /p <Пароль SIEBEL> /c <Актуальный ODBC стенда> /g SSE_ROLE /b SIEBEL_DATA /x SIEBEL_INDX /R N /9 Y /S Y /W Y /N Y /6 1000 /f <Путь до поставки>\\" + ver + "\\scheme\\" + DDLFileName + ".ctl /l <Путь до поставки>\\" + ver + "\\scheme\\" + DDLFileName + ".log /q <Путь до поставки>\\" + ver + "\\scheme\\" + DDLFileName + ".sql<p>",
      repFileFILFR: "Выполнить команду в cmd консоли с правами администратора: <p><p style=\"margin-left: 50px;\">C:\\ses\\siebsrvr\\BIN\\repimexp.exe /u SADMIN /p SADMIN /l C:\\atc\\Releases\\" + ver + "\\repository\\" + repFileName + ".log /f C:\\atc\\Releases\\" + ver + "\\repository\\" + repFileName + ".dat /A P /d SIEBEL /Z 1000 /r \"Migrated Repository\" /c SBLTST_DSN<p>",
      repFileFIL:"Выполнить команду в cmd консоли с правами администратора: <p><p style=\"margin-left: 50px;\">C:\\ses\\siebsrvr\\BIN\\repimexp.exe /u SADMIN /p SADMIN /l C:\\atc\\Releases\\" + ver + "\\repository\\" + repFileName + ".log /f C:\\atc\\Releases\\" + ver + "\\repository\\" + repFileName + ".dat /A P /d SIEBEL /r \"Siebel Repository\" /c SBLTST_DSN<p>",
      stepSchemeFIL:"По окончанию выполнить сгенерированный файл <Путь до поставки>\\" + ver + "\\scheme\\" + DDLFileName + ".sql",
      DDLFileFIL:"Выполнить команду в cmd консоли с правами администратора: <p><p style=\"margin-left: 50px;\">C:\\ses\\siebsrvr\\BIN\\ddlimp.exe /u SIEBEL /p SIEBEL /c SBLTST_DSN /g SSE_ROLE /b SIEBEL_DATA /x SIEBEL_INDX /R N /9 Y /S Y /W Y /N Y /6 1000 /f C:\\atc\\Releases\\" + ver + "\\scheme\\" + DDLFileName + ".ctl /l C:\\atc\\Releases\\" + ver + "\\scheme\\" + DDLFileName + ".log /q C:\\atc\\Releases\\" + ver + "\\scheme\\" + DDLFileName + ".sql<p>",
      
    }
    //обработка объектов
    for (let i = 0; i < listOftr.length; i++) { // 
      let element = listOftr[i];
      listOftd = Array.from(element.querySelectorAll('td'))
      sNameOb = listOftd[0].querySelectorAll('input')[0].value
      if (!sNameOb) continue;
      sName = listOftd[1].querySelectorAll('textarea')[0].value
      sName = sName.split(',')
      let regexp = /^\s+|\s+$/g
      sName = sName.map(item=>item.replace(regexp,""))
      listName = [];
      if(sNameOb == 'Task'){
        tasks = sName;
      }
      if(sNameOb == 'DV'){
        DV = sName
      }
      if(serverFlg == 'N' && (sNameOb == 'JS' || sNameOb == 'HTML' || sNameOb == 'CSS' || sNameOb == 'images')){
        serverFlg = 'Y'
      }
      if(ADMFlg == 'N' && (sNameOb == 'Pers.Applets' || sNameOb == 'Pers.Rules' || sNameOb == 'Pers.Views' || sNameOb == 'Pers.Events /RTE' || sNameOb == 'Pers.Actions'  || sNameOb == 'DVM' || sNameOb == 'EAI Lookup Map' || sNameOb == 'EAI Data Map' || sNameOb == 'Comm Pkg' || sNameOb == ' Inb.WS' || sNameOb == 'Out.WS' || sNameOb == 'DTU/Data Map' || sNameOb == 'Log Conf.' || sNameOb == 'Audit Trail' || sNameOb == 'Wf Action Type' || sNameOb == 'Wf Policy' || sNameOb == 'АДМ - представление' || sNameOb == 'Responsibility' || sNameOb == 'SysPref' || sNameOb == 'PDQ' || sNameOb == 'LOV' || sNameOb == 'LOV Constant' || sNameOb == 'SmartScript' || sNameOb == 'Task Resp.')){
        ADMFlg = 'Y'
      }
      if(trigFlg == 'N' && (sNameOb == 'Wf Policy' || sNameOb == 'Wf Action Type' || sNameOb == 'WFP Column' || sNameOb == 'WFP Program' || sNameOb == 'WFP Object')){
        trigFlg = 'Y'
      }
      if (cashApp == 'N' && (sNameOb == 'Pers.Applets' || sNameOb == 'Pers.Rules' || sNameOb == 'Pers.Views')){
        cashApp = 'Y'
      }
      if(cashMap == 'N' && (sNameOb == 'DataMap' )){
        cashMap = 'Y'
      }
      if(cashLov == 'N' && (sNameOb == 'LOV' || sNameOb == 'LOV Constant')){
        cashLov = 'Y';
      }
      if(cashEvent == 'N' && (sNameOb == 'RTE' || sNameOb == 'Personalization – Actions')){
        cashEvent = 'Y';
      }
      if(sNameOb == 'RTE' || sNameOb == 'EFS Profile'){

      }
    }


    if(tasks.length == 0){
      maunu_obj.stepTask =""
      maunu_obj.stepTaskActive = ""
    } else {
      for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        maunu_obj.stepTaskActive += "<p style=\"margin-left: 50px;\">* " + element
      }
    }

    if(DV.length == 0){
      maunu_obj.stepDV =""
    } else {
      for (let i = 0; i < DV.length; i++) {
        const element = DV[i];
        maunu_obj.stepDV += "<p style=\"margin-left: 50px;\"> * " + element
      }
    }

    if(serverFlg == 'N'){
      maunu_obj.stepSercFile = ""
    }

    if(ADMFlg == 'N'){
      maunu_obj.stepADMFile = "";
      maunu_obj.stepADMRun = "";
    }

    if(trigFlg == 'N') {
      maunu_obj.stepTrig = ""
    }

    if(cashApp == 'Y'){
      maunu_obj.stepCash += "<p style=\"margin-left: 50px;\">* \"Администрирование - Индивидуальная настройка -> Апплеты\" нажать на лист-апплете на шестеренку и в выпадающем списке выбрать \"Перезагрузка правил индивидуальной настройки\""
    }

    if(cashMap == 'Y'){
      maunu_obj.stepCash += "<p style=\"margin-left: 50px;\">* \"Администрирование - приложени -> Администрирование карты данных\" произвести очистку кэша"
    }

    if(cashLov == 'Y'){
      maunu_obj.stepCash += "<p style=\"margin-left: 50px;\">                 * \"Администрирование - данные -> Список значений\" произвести очистку кэша"
    }

    if(cashEvent == 'Y'){
      maunu_obj.stepCash += "<p style=\"margin-left: 50px;\">* \"Администрирование - события обработки -> События\", нажать на шестеренку на апплете вверху справа и выбрать пункт \"Перезагрузка событий времени выполнения\""
    }

    if(cashApp == 'N' && cashMap == 'N' && cashLov == 'N' && cashEvent == 'N'){
      maunu_obj.stepCash = ""
    }



    //отрисовка 
    manu_bank = document.createElement('p');
    manu_fil = document.createElement('p');
    manu_fil.setAttribute('id','manu_fil');
    manu_bank.setAttribute('id','manu_bank');
    document.getElementById('renderToStend').appendChild(manu_fil);
    document.getElementById('renderForBank').appendChild(manu_bank);
    manu_bank.prepend()
    manu_fil.prepend()
    let num = 0;
    for (var key in maunu_obj) {
      if(maunu_obj[key] != ""){
        num++;
      }
    }
    num = num -3;
    let num_b = num;
    for (const key in maunu_obj) {
      let a = document.createElement('li')
      if(key!= 'stepSchemeBNK' && key!='repFileBNK' && key!='DDLFileBNK' && maunu_obj[key] != ""){
        if(fullRRFlg == true){
          if(key != 'repFileFIL') {
            a.innerHTML = num_b + ") " + maunu_obj[key]
            manu_fil.prepend(a)
            num_b--;
          }
        } else {
            if(key != 'repFileFILFR') {
              a.innerHTML = num_b + ") " + maunu_obj[key]
              manu_fil.prepend(a)
              num_b--;
            }
        }
      }
    }
    let num_a = num;
    for (const key in maunu_obj) {
      let a = document.createElement('li')
      if(key!= 'stepSchemeFIL' && key!='DDLFileFIL' && key!='repFileFIL' && key!='repFileFILFR' && maunu_obj[key] != ""){
        a.innerHTML = num_a + ") " + maunu_obj[key]
        manu_bank.prepend(a)
        num_a--;
      };
    }
  }
  
  switch(type)
  {
    case 'Build':
      createListBuild()
      break;
    case 'Manual':
      createManual()
      break;
  }
}
