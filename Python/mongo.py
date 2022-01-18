from pymongo import MongoClient 




def store_db(name, owner,data):  
    try: 
        conn = MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
        print("Connected successfully!!!") 
    except:   
        print("Could not connect to MongoDB") 
  
    # database 
    db = conn.test.users 

    collection = db.images
    result = db.find_one({"name":"Seema"})
    print(result)



