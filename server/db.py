import sqlite3

#from in class
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
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT * FROM schedule")
        return self.cursor.fetchall()
        print("the rows are", rows)

    def saveRecord(self, record):
        self.cursor.execute("INSERT INTO schedule (type, code, layman, semester) VALUES (?, ?, ?, ?)", record)
        self.connection.commit()

    #from in class
    def editRecord(self, id, d):
        data = (d["type"], d["code"], d["layman"], d["semester"], id)
        self.cursor.execute("UPDATE schedule SET type = ?, code = ?, layman = ?, semester = ? WHERE id = ?", data)
        self.connection.commit()

    def deletRecord(self, record_id):
        self.cursor.execute("DELETE FROM schedule WHERE id = ?", (record_id,))
        self.connection.commit()

    def close(self):
        self.connection.close()

    
if __name__ == "__main__":
    db = DB("classes.db") #try
    db.cursor.execute('''CREATE TABLE IF NOT EXISTS schedule
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      type TEXT,
                      code TEXT,
                      layman TEXT,
                      semester TEXT)''')
    db.connection.commit()
    db.close()
