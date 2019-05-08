<game>

    <div class="row">
        <h1> Runde 1 </h1>
    </div>

    <div class="row">
        <div class="one-half columns offset-by-four panel">
           <challenge image={opts.image}></challenge>
        </div>
    </div>

    <!-- answers -->
    <div class="row">
        <div class="three columns">&nbsp;</div>
        <div each={opts.answers} class="two columns">
            <answer name={name} correct={correct}></answer>
        </div>
    </div>

    <br/>

    <!-- progress bar -->
    <div class="row">
        <div class="four columns">&nbsp;</div>
        <div class="four columns">
            <progress-bar value=0></progress-bar>
        </div>
    </div>
</game>



<challenge>
    <img src={opts.image} alt="challenge image"/>

    <script>
        this.observable.on("init_round", args => console.log(args));
    </script>
</challenge>

<progress-bar>
    <progress value={this.value} max="10"></progress>

    <script>
        this.value = opts.value;
        this.currentTimeout = null;
        this.stopped = false;

        setTimeout(() => {this.value +=0.5;this.update();}, 500);
        /*scheduleTimeout = function(e) {
            console.log(parent.value);
            if ((!this.stopped) && (this.value<10)) {
               this.currentTimeout = setTimeout(scheduleTimeout, 1000);
               this.value += 1;
            }
        };
        scheduleTimeout();*/
    </script>

</progress-bar>

<answer>
    <button onclick={checkAnswer} disabled={this.disabled} class={this.status}>{opts.name}</button>

    <script>
        this.status = "";
        this.correct = opts.correct;   // somehow opts.correct resets to false after first access, copying it fixes that
        this.disabled = false;

        this.observable.on("human_correct", () => {this.disabled="disabled"; this.update();});

        checkAnswer = function(e) {
            if (this.correct) {
                this.status = "correct";
                this.observable.trigger("human_correct");
            }
            else {
                this.status = "incorrect";
                this.observable.trigger("human_incorrect");
            }
        };
    </script>
</answer>