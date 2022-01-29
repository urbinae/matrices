var generateArray = function (rows, columns) {
    const arr = [];
    const limite = rows * columns;
    for (var i = 0; i < limite; i++) {
        const r = Math.random() * 10
        arr.push(Math.floor(r));
    }
    var listRepetead = repeatedNumbers(arr)

    if (!validateRepeatedNumbers(listRepetead))
        generateArray(rows, columns)

    var result = [];
    result[0] = unSort(arr);
    result[1] = listRepetead;
    return result;
};

var repeatedNumbers = function (arrayNumbers) {
    var arraySort = arrayNumbers.sort();
    var repeatedNumbers = new Map();
    var contador = 1;
    for (var index = 0; index < arraySort.length; index++) {
        if (arraySort[index + 1] == arraySort[index]) {
            contador++;
        } else {
            repeatedNumbers.set(arraySort[index], contador);
            contador = 1;
        }
    }
    return repeatedNumbers;
}

var validateRepeatedNumbers = function (repeatedNumbers) {
    let most_repeted1 = [...repeatedNumbers.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
    console.log(most_repeted1);
    let most_repeted2 = [...repeatedNumbers.entries()].reduceRight((a, e) => e[1] > a[1] ? e : a);
    console.log(most_repeted2);
    
    return JSON.stringify(most_repeted1) === JSON.stringify(most_repeted2)
}

var mostRepetedNumber = function (repeatedNumbers) {
    let most_repeted = [...repeatedNumbers.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
    return most_repeted;
}

var makeMatriz = function (array, rows, columns) {
    var matriz = [];
    var fila = []
    var index = 0
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            fila.push(array[index]);
            index++
        }
        matriz.push(fila)
        fila = []
    }
    return matriz;
}

var unSort = function (my_array) {
    var t = my_array.sort(function (a, b) { return (Math.random() - 0.5) });
    return [...t];
}

var answerOptions = function (listRepetead, mostRepetead) {
    let numbers = [];
    let answer = mostRepetead[0]
    let veces = mostRepetead[1]
    console.log('El ' + answer + ' se repite ' + veces + ' veces')
    listRepetead.delete(mostRepetead[0]);
    for (let [key, value] of listRepetead) {
        numbers.push(key)
    }

    let options = [];
    options.push(answer)
    for (var i = 0; i < 3; i++) {
        var idx = Math.floor(Math.random() * numbers.length);
        options.push(numbers[idx]);
        numbers.splice(idx, 1);
    }
    options = unSort(options);
    return options
}

new Vue({
    data: {
        array: [],
        listRepetead: [],
        mostRepeated: null,
        rows: 4,
        columns: 4,
        matriz: [],
        options: [],
        counter: 0,
        respondio: false,
        cantQuestions: 10,
        correctAnswers: 0,
        finished: true,
        beforeOfStart: true,
        percent: 0,
        showAlert: false,
        showAlertMax: false,
        runClock: null,
        startTimestamp: 0,
    },
    mounted: function () {

    },
    methods: {
        generate: function (rows, columns) {
            var self = this;
            var arrays = generateArray(rows, columns);
            self.array = arrays[0];
            self.listRepetead = arrays[1];
            // console.log(self.array)
            console.log(self.listRepetead)
            self.mostRepeated = mostRepetedNumber(self.listRepetead)
            // console.log(self.mostRepeated)

            self.matriz = makeMatriz(self.array, self.rows, self.columns);
            self.options = answerOptions(self.listRepetead, self.mostRepeated)
        },
        answer: function (elem) {
            this.counter++;
            let boton1 = document.getElementById(elem);
            let boton2 = document.getElementById(this.mostRepeated[0]);
            if (elem == this.mostRepeated[0]) {
                this.correctAnswers++;
                boton2.className = "btn btn-success";
            } else {
                boton2.className = "btn btn-success";
                boton1.className = "btn btn-danger";
            }
            this.options.forEach(element => {
                $('#' + element).prop('disabled', true);
            });
            this.respondio = true
            this.showAlert = false
        },
        btnNext: function () {
            var self = this;
            this.options.forEach(element => {
                $('#' + element).prop('disabled', false);
            });
            if (this.counter == this.cantQuestions) {
                clearInterval(this.runClock);
                var porcentaje = this.correctAnswers / this.cantQuestions * 100
                if (porcentaje == 100)
                    this.percent = "width: " + porcentaje + "%; border-radius: 10px"
                else
                    this.percent = "width: " + porcentaje + "%; border-radius: 10px 0 0 10px"

                this.finished = false
            } else {
                if (this.respondio) {
                    this.options.forEach(element => {
                        document.getElementById(element).className = 'btn btn-default';
                    });
                    this.generate(self.rows, self.columns)
                    this.respondio = false
                } else {
                    this.showAlert = true
                }
            }
        },
        btnAgain: function () {
            this.respondio = false
            this.counter = 0;
            this.correctAnswers = 0
            this.finished = true
            this.generate(this.rows, this.columns)
            document.getElementById('timer').innerHTML = '';
            clearInterval(this.runClock)
            this.initCounter()
        },
        btnStart: function () {
            this.rows = $("#numfilas").val()
            this.columns = $("#numcolumnas").val()

            if (this.rows > 10 || this.columns > 10 || this.rows < 5 || this.columns < 5) {
                this.showAlertMax = true
            } else {6
                this.beforeOfStart = false
                this.generate(this.rows, this.columns)
            }
            // clearInterval(this.runClock)
            this.initCounter()

        },
        initCounter: function () {
            var startTimestamp = 0;
            this.runClock = setInterval(function () {
                startTimestamp++;
                document.getElementById('timer').innerHTML =
                    '<b>' + moment.unix(startTimestamp).format('mm:ss') + '</b>';
            }, 1000);
        }

    },
    template: `
        <div class="container">
            <div v-if="beforeOfStart">
            <h5 class="card-title">Ingresar el número de filas y columnas que tendrá la matriz</h5>
                    <div class="row">
                        <div class="col-md-2">
                            <div class="form-group">
                                <input type="number" class="form-control" value="5" min="5" max="10" placeholder="Filas" id="numfilas">
                            </div>
                            <div class="form-group">
                                <input type="number" class="form-control" value="6" min="5" max="10" placeholder="Columnas" id="numcolumnas">
                            </div>
                        </div>
                    </div>
                    <div v-if="showAlertMax" >
                        <div class="row alert alert-warning alert-dismissible show" role="alert">
                            El tamaño mínimo debe ser 5x5 y el tamaño máximo debe ser 10x10
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <button class="btn btn-next" v-on:click="btnStart">Comenzar</button>
                        </div>
                    </div>
                    
                </div>
            <div v-else>
            <div id="timer"></div>
                <div v-if="finished" class="row questions">
                    
                    <div class="col-md-9">   
                        <div v-if="showAlert" >
                            <div class="row alert alert-warning alert-dismissible show" role="alert">
                                Eligir una opción
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>                 
                        <div class="table-responsive">
                            <table class="table matriz table-bordered" id="matriz" style="border: solid;">
                                <tbody>
                                    <tr v-for="elem in matriz">
                                        <td v-for="n in elem" class="matriz">{{ n }} </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </div>
                    </div> 
                    <div class="col-md-3">
                        <div v-for="elem in options">
                            <button type="button" :id="elem" v-on:click="answer(elem)" style="" class="btn btn-default">{{ elem }}</button>
                        </div>
                            <br>
                            <button class="btn btn-next" v-on:click="btnNext">Siguiente</button>
                    </div>
                </div>
                <div v-else class=" answers">
                    <div class="">
                        Su resultado
                        <div class="progress">
                            <div class="progress-bar bg-success" role="progressbar" :style="percent" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="float-right"> <b> {{correctAnswers}}</b>/{{cantQuestions}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
}).$mount('#app');