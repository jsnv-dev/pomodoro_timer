
var Pmdr = Pmdr || {};
Pmdr.Views = {};

Pmdr.Views.CountdownView = Backbone.View.extend({
    el: '#countdown',
    initialize: function() {
        this.listenTo(this.model, 'countedDown', this.render);
        this.listenTo(this.model, 'change:isStarted', this.render);
        this.render();
    },

    render: function() {
        var remainingSeconds = this.model.get('remainingSeconds');
        if (remainingSeconds === null) {
            remainingSeconds = 0;
        }
        var value = Pmdr.utils.prettifySeconds(remainingSeconds);
        this.$el.html(value);
        return this;
    },
});

Pmdr.Views.PomodorosView = Backbone.View.extend({

    el: '#pomodoros',

    initialize: function() {
        this.listenTo(this.collection, 'add', this.render);
    },

    render: function() {
        this.$el.html(this.collection.length);
        return this;
    }

});

Pmdr.Views.StartButtonView = Backbone.View.extend({

    tagName: 'button',
    className: 'ctrlButton',

    events: {
        'click': 'start'
    },

    initialize: function(options) {
        this.title = options.title;
        this.type = options.type;
        this.duration = options.duration;
        this.listenTo(this.model, 'change:isStarted', this.render);
    },

    render: function() {
        this.$el.text(this.title);
        this.$el.prop('disabled', this.model.get('isStarted'));
        return this;
    },

    start: function() {
        this.model.start({
            duration: this.duration,
            type: this.type
        });
    }
});


Pmdr.Views.StopButtonView = Backbone.View.extend({

    tagName: 'button',
    className: 'ctrlButton',

    events: {
        'click': 'stop'
    },

    initialize: function() {
        this.listenTo(this.model, 'change:isStarted', this.render);
    },

    render: function() {
        this.$el.text('stop');
        this.$el.prop('disabled', !this.model.get('isStarted'));
        return this;
    },

    stop: function() {
        this.model.stop();
    }
});


Pmdr.Views.CtrlView = Backbone.View.extend({
    el: '#ctrlView',

    initialize: function() {
        this.pomodoroButton = new Pmdr.Views.StartButtonView({
            'model': this.model,
            'title': 'start',
            'duration': 51 * 60,
            'type': 'pomodoro',
        });

        this.shortBreakButton = new Pmdr.Views.StartButtonView({
            'model': this.model,
            'title': 'break',
            'duration': 5 * 60,
            'type': 'short-break',
        });

        this.longBreakButton = new Pmdr.Views.StartButtonView({
            'model': this.model,
            'title': 'long break',
            'duration': 10 * 60,
            'type': 'long-break',
        });

        this.stopButton = new Pmdr.Views.StopButtonView({
            'model': this.model
        });

        this.render();
    },

    stopTimer: function() {
        this.model.stop();
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.pomodoroButton.render().$el);
        this.$el.append(this.shortBreakButton.render().$el);
        this.$el.append(this.longBreakButton.render().$el);
        this.$el.append(this.stopButton.render().$el);
    }
});

Pmdr.Views.DynamicTitleView = Backbone.View.extend({
    el: '#dynamicTitleCb',
    events: {
        change: 'onChange'
    },
    initialize: function() {
        this.onChange();
        this.listenTo(this.model, 'countedDown', this.render);
        this.listenTo(this.model, 'stopped', this.render);
    },
    onChange: function() {
        this.dynamicTitle = this.$el.prop('checked');
        this.render();
    },
    render: function() {
        var title = 'Pmdr';

        if (this.dynamicTitle) {
            title = Pmdr.utils.prettifySeconds(this.model.get('remainingSeconds'));
        }

        $('title').text(title);
    }
});
