import sqlite3

def dict_factory(cursor, row):
    fields = []
    # Extract column names from cursor description
    for column in cursor.description:
        fields.append(column[0])

    # Create a dictionary where keys are column names and values are row values
    result_dict = {}
    for i in range(len(fields)):
        result_dict[fields[i]] = row[i]

    return result_dict

class DB:
    def __init__(self, dbfilenmae):
        self.dbfilename = dbfilenmae
        self.connection = sqlite3.connect(self.dbfilename)
        self.cursor = self.connection.cursor()

    def readAllRecords(self):
        self.cursor.execute("SELECT * FROM schedule")
        return self.cursor.fetchall()
        print("the rows are", rows)

    def saveRecord(self, record):
        self.cursor.execute("INSERT INTO schedule (type, code, layman, semester) VALUES (?, ?, ?, ?)", record)
        self.connection.commit()

    def close(self):
        self.connection.close()

    
if __name__ == "__main__":
