class ExerciseTracker {
    constructor() {
        this.exercises = this.loadExercises();
        this.prs = this.loadPRs();
        this.form = document.getElementById('exercise-form');
        this.exerciseList = document.getElementById('exercise-list');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.displayExercises();
        this.displayPRs();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const exercise = {
            id: Date.now(),
            name: document.getElementById('exercise-name').value,
            sets: parseInt(document.getElementById('sets').value),
            reps: parseInt(document.getElementById('reps').value),
            weight: parseFloat(document.getElementById('weight').value) || 0,
            date: new Date().toLocaleDateString()
        };
        
        this.addExercise(exercise);
        this.form.reset();
    }
    
    addExercise(exercise) {
        this.exercises.unshift(exercise);
        this.saveExercises();
        this.checkAndUpdatePR(exercise);
        this.displayExercises();
    }
    
    deleteExercise(id) {
        this.exercises = this.exercises.filter(exercise => exercise.id !== id);
        this.saveExercises();
        this.displayExercises();
    }
    
    displayExercises() {
        if (this.exercises.length === 0) {
            this.exerciseList.innerHTML = '<div class="no-exercises">No exercises recorded yet. Add your first exercise above!</div>';
            return;
        }
        
        this.exerciseList.innerHTML = this.exercises.map(exercise => 
            `<div class="exercise-item">
                <div class="exercise-details">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-stats">
                        ${exercise.sets} sets × ${exercise.reps} reps
                        ${exercise.weight > 0 ? ` @ ${exercise.weight} lbs` : ''}
                    </div>
                    <div class="exercise-date">${exercise.date}</div>
                </div>
                <button class="delete-btn" onclick="tracker.deleteExercise(${exercise.id})">Delete</button>
            </div>`
        ).join('');
    }
    
    saveExercises() {
        localStorage.setItem('exercises', JSON.stringify(this.exercises));
    }
    
    loadExercises() {
        const saved = localStorage.getItem('exercises');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadPRs() {
        const saved = localStorage.getItem('prs');
        return saved ? JSON.parse(saved) : {
            bench: 0,
            deadlift: 0,
            squat: 0
        };
    }
    
    savePRs() {
        localStorage.setItem('prs', JSON.stringify(this.prs));
    }
    
    checkAndUpdatePR(exercise) {
        const exerciseName = exercise.name.toLowerCase();
        const weight = exercise.weight;
        
        if (weight > 0) {
            let prKey = null;
            
            if (exerciseName.includes('bench')) {
                prKey = 'bench';
            } else if (exerciseName.includes('deadlift')) {
                prKey = 'deadlift';
            } else if (exerciseName.includes('squat')) {
                prKey = 'squat';
            }
            
            if (prKey && weight > this.prs[prKey]) {
                this.prs[prKey] = weight;
                this.savePRs();
                this.displayPRs();
            }
        }
    }
    
    displayPRs() {
        document.getElementById('bench-pr').textContent = this.prs.bench > 0 ? `${this.prs.bench} lbs` : '0 lbs';
        document.getElementById('deadlift-pr').textContent = this.prs.deadlift > 0 ? `${this.prs.deadlift} lbs` : '0 lbs';
        document.getElementById('squat-pr').textContent = this.prs.squat > 0 ? `${this.prs.squat} lbs` : '0 lbs';
    }
}

const tracker = new ExerciseTracker();