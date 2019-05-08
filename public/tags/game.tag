<game>

    <div class="row">
        <h1> Runde 1 </h1>
    </div>

    <div class="row">
        <div class="one-half columns offset-by-four panel">
           <challenge image={opts.image}></challenge>
        </div>
    </div>

    <div class="row">
       <response answers={opts.answers}></response>
    </div>

    <script>
       const data = opts;
       this.on('mount', () => this.observable.trigger("init_round", 1));
    </script>
</game>



<challenge>
    <img src={opts.image}></img>

    <script>
        this.observable.on("init_round", args => console.log(args))
    </script>
</challenge>



<response>
    <div class="three columns">&nbsp;</div>
    <div each={answer in opts.answers} class="two columns">
       <button onclick={edit}>{answer}</button>
    </div>
    
    edit(e) {
         //e.preventDefault();
         //this.observable.trigger("answer_selected", "hallo")
         console.log(e);
    }

    <script>
        this.observable.on("answer_selected", args => console.log(args))
    </script>
</response>