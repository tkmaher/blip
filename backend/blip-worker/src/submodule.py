import hashlib

def validate_pw(password):
    encoded_data = password.encode('utf-8')
    hash_object = hashlib.sha256(encoded_data)
    hex_digest = hash_object.hexdigest()
    return hex_digest == "acb58eaf8eadaa028d63542c7d2cdf7a09410a34e99e5a8566b5f3929924268c"

def get_mailinglist():
    return {"mailinglist": ["example@example.com", "example1@example.com"]}

def get_info():
    return {"info": "This is some info from the submodule."}