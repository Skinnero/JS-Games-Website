from data_handler.connection import CURSOR

def save_score_to_db(data:dict) -> None:
    """Creates sql query to save data into scoreboard table

    Args:
        data (dict): data from json file
    """    
    data = [str(v) for v in data.values()]
    print(data)
    query = "INSERT INTO scoreboard(user_name, game, score) VALUES (%s, %s, %s)"
    CURSOR.execute(query,data)

def read_db_for_hof():
    """Reads scoreboard data for hall of fame display

    Returns:
        list: list with dicts from cursor.fetchall()
    """    
    CURSOR.execute(
        "SELECT user_name, game, score FROM scoreboard;"
    )
    return CURSOR.fetchall()