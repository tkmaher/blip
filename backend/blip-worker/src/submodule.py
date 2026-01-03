import hashlib

def validate_pw(password):
    encoded_data = password.encode('utf-8')
    hash_object = hashlib.sha256(encoded_data)
    hex_digest = hash_object.hexdigest()
    return hex_digest == "acb58eaf8eadaa028d63542c7d2cdf7a09410a34e99e5a8566b5f3929924268c"

async def get_mailinglist(db):
    try:
        stmt = db.prepare("SELECT address FROM emails")
        result = await stmt.all()
        emails = [str(row.address) for row in result.results]

    except Exception as e:
        print("DB error:", e)
        emails = []

    return {"mailinglist": emails}

async def get_info(db):
    try:
        stmt = db.prepare('SELECT info FROM info LIMIT 1')
        row = await stmt.first()
        info = row.info
    except Exception as e:
        print(e)
        info = "info not found"
    return {"info": info}

async def post_info(new_info, db):
    print("Posting new info:", new_info)
    try:
        await db.prepare('DELETE FROM info').run()
        await db.prepare('INSERT INTO info (info) VALUES (?)').bind(new_info).run()
    except Exception as e:
        print(e)
        return False
    return True

async def delete_email(email, db):
    try:
        await db.prepare('DELETE FROM emails WHERE address = ?').bind(email).run()
    except Exception as e:
        print(e)
        return False
    return True