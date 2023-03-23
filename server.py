from flask import Flask, render_template, request, redirect, url_for, jsonify
from data_handler import data_handler

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hangman')
def hangman():
    return render_template('hangman.html')


@app.route('/snake')
def snake():
    return render_template('snake.html')

@app.route('/reaction-time')
def reaction_time_game():
    return render_template('reaction_time_game.html', game_name='reaction_time_game')

@app.route('/typing')
def typing_game():
    return render_template('typing_game.html') 

@app.route('/save', methods=['POST'])
def save():
    data_handler.save_score_to_db(request.json)
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(
        debug=True,
        host="0.0.0.0",
    )