from data_handler.connection import CURSOR

def save_score_to_db(data:dict) -> None:

    data = [str(v) for v in data.values()]
    print(data)
    query = "INSERT INTO scoreboard(user_name, game, score) VALUES (%s, %s, %s)"
    CURSOR.execute(query,data)