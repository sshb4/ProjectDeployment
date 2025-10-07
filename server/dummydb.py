import json
import os.path

    ### USAGE EXAMPLE:
    ##  from dummydb import DummyDB

    #### SAVE DICTIONARY RECORD:
    ##  dictRecord = { 'conditions': 'rain', 'temp': 55 }
    #  db = DummyDB('mydatabase.db')
    #  db.saveRecord(dictRecord)

    ### SAVE STRING RECORD:
    ##  strRecord = 'cold rainy day'
    #  db = DummyDB('mydatabase.db')
    #  db.saveRecord(strRecord)

    ### READ ALL RECORDS:
    #  db = DummyDB('mydatabase.db')
    #  allRecords = db.readAllRecords()
    #  print(allRecords)


class DummyDB:
    def __init__(self, filename):
        self.filename = filename
        if not os.path.isfile(filename):
            with open(self.filename, 'w') as f:
                json.dump([], f)

    def readAllRecords(self):
        self.cursor.execute("SELECT * FROM schedule")
        rows = self
        all = []
        for row in rows:
            d = dict_factory(self.cursor, row)
            all.append(d)
        print("the rows are", all)
        return all

    def saveRecord(self, record):
        all = self.readAllRecords()
        all.append(record)
        with open(self.filename, 'w') as f:
            json.dump(all, f)


