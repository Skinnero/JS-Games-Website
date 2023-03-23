import psycopg2
from psycopg2.extras import RealDictCursor
from os import environ
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Assign table names from DB to constant variables
SCOREBOARD = 'scoreboard'

# Assigns enviroment data to constant variables
DATABASE = environ.get('DATABASE')
USER = environ.get('USER')
PASSWORD = environ.get('PASSWORD')

def connect_to_database():
    """Connects to database using enviroment variables

    Raises:
        exception: psycopg2.DatabasError

    Returns:
        object: cursor(RealDictCursor)
    """    
    try:
        with psycopg2.connect(database=DATABASE, user=USER, password=PASSWORD) as connection:
            connection.autocommit = True
            return connection.cursor(cursor_factory=RealDictCursor)
    except psycopg2.DatabaseError as exception:
        print('Database connection problem')
        raise exception
    
# Assigns cursor to constant variable so you can import it
CURSOR = connect_to_database()