import sqlite3
import bcrypt

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

    def editRecord(self, id, d):
        data = (d["type"], d["code"], d["layman"], d["semester"], id)
        self.cursor.execute("UPDATE schedule SET type = ?, code = ?, layman = ?, semester = ? WHERE id = ?", data)
        self.connection.commit()

    def deleteRecord(self, record_id):
        self.cursor.execute("DELETE FROM schedule WHERE id = ?", (record_id,))
        self.connection.commit()

    def getUserPasswordByEmail(self, email):
        self.cursor.execute("SELECT password FROM users WHERE email = ?", (email,))
        row = self.cursor.fetchone()
        print(f"Returning the user {row}")
        return row

    def saveUser(self, record):
        plaintext_password = record["password"]
        encrypted_password = bcrypt.hash(plaintext_password)
        data = [record["first_name"], record["last_name"], record["email"], encrypted_password]
        self.cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", data)
        self.connection.commit()

    def saveRecord(self, record):
        data = [record["type"], record["code"], record["layman"], record["semester"]]
        self.cursor.execute("INSERT INTO schedule (type, code, layman, semester) VALUES (?, ?, ?, ?)", record)
        self.connection.commit()

    def validatePassword(self, email, password):
        stored_password = self.getUserPasswordByEmail(email)
        if stored_password is not None:
            if bcrypt.verify(password, stored_password[0]):
                print("Valid")
                return True
        return False

    def close(self):
        self.connection.close()

    

    
if __name__ == "__main__":
    db = DB("classes.db") 
    db.readAllRecords()
    db.saveRecord(1)
    db.readAllRecords()
    db.close()
