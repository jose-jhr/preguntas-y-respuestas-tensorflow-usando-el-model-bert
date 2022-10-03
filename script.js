var elementSelect = document.getElementById('sel1');
elementSelect.addEventListener('change', function() {
    var selectedValue = elementSelect.options[elementSelect.selectedIndex].value;
    //insert selected value in input
    document.getElementById("question").value = selectedValue
});


//detect enter keyboard event call function responseTf
document.getElementById("question").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        responseModel();
    }
});

var passage = readTextFile("datesRicaurte.txt").toString();
var passage_en = translate(passage, "es", "en").toLocaleLowerCase();


//get content in txt file located in local folder
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}



function responseModel(){
    //var passage = document.getElementById("passage").value;
    var questionInput = document.getElementById("question").value;
    responseTf(questionInput.toString());
}


function responseTf(questionInput){
    
    //get content of passage and question

    if(questionInput !== ""){

    //passage text to lower case
    passage = passage.toLowerCase();
    questionInput = questionInput.toLowerCase();

    //traslate passage and question to english
    var question_en = translate(questionInput, "es", "en").toLocaleLowerCase();

    let p = document.createElement("p");
    
    p.innerHTML = "cargando...";
    //clear div
    document.getElementById("answer").innerHTML = "";
    //append to div
    document.getElementById("answer").appendChild(p);
    
    qna.load().then(model => {

        // Find the answers
        model.findAnswers(question_en, passage_en).then(answers => {

            if(answers.length > 0){
                //create <p> html element show answer and point
                let p = document.createElement("p");
                //recorre el array de respuestas
                for (var i = 0; i < answers.length; i++) {
                    //get the answer json 
                    let answer = answers[i].text;
                    let point = answers[i].score;
                    //translate answer to spanish
                    let answer_es = translate(answer, "en", "es");
                    p.innerHTML += "Respuesta: <b>" + answer_es + "</b> Puntuacion de Modelo: " + point+"<br>";
                }
                 //clear div
                 document.getElementById("answer").innerHTML = "";
                 //append to div
                 document.getElementById("answer").appendChild(p);
            }else{
                funNoFound();
            }   
        });
      });
    }else{
        alert("Por favor ingrese una pregunta");
    }
}


function funNoFound(){
    repeat = 0; 
    let p = document.createElement("p");
    p.innerHTML = "El modelo IA no pudo encontrar una respuesta";
    //clear div
    document.getElementById("answer").innerHTML = "";
    //append to div
    document.getElementById("answer").appendChild(p);
}

function translate(text, from, to){
    var result = "";
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + from + "&tl=" + to + "&dt=t&q=" + encodeURI(text);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    //add result to json
    var json = JSON.parse(xmlHttp.responseText);
    //convert json to string with for
    for (var i = 0; i < json[0].length; i++) {
        result += json[0][i][0];
    }

    return result;
}
