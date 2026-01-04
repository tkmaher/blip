from workers import Response, WorkerEntrypoint
import json
from urllib.parse import urlparse, parse_qs
from submodule import get_info, validate_pw, get_mailinglist, post_info, delete_email, post_email

corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
}

class Default(WorkerEntrypoint):
    async def fetch(self, request):
        parsed_url = urlparse(request.url)
        query_dict = parse_qs(parsed_url.query)
        getter = query_dict["data"]
        method = request.method
        password = query_dict.get("password", [""])[0]

        if method == "GET":
            if getter[0] == "info":
                res = await get_info(self.env.BLIP_DATABASE)
                return Response(json.dumps(res), headers=corsHeaders)
            if getter[0] == "mailinglist":
                if password and validate_pw(password):
                    res = await get_mailinglist(self.env.BLIP_DATABASE)
                    return Response(json.dumps(res), headers=corsHeaders)
                else:
                    return Response("Invalid password", status=401)
            return Response("Invalid Request", status=400)
        if method == "POST" and password and validate_pw(password):
            if getter[0] == "login":
                return Response("Login successful", status=200, headers=corsHeaders)
            if getter[0] == "info":
                print("Posting new info")
                body = await request.json()
                result = await post_info(body["info"], self.env.BLIP_DATABASE)
                if result:
                    return Response("Info updated", status=200, headers=corsHeaders)
                else:
                    return Response("Failed to update info", status=500)
        elif method == "POST" and getter[0] == "mailinglist":
            body = await request.json()
            email = body.get("email", "")
            if email:
                result = await post_email(email, self.env.BLIP_DATABASE)
                if result:
                    return Response("Email added to mailing list", status=200, headers=corsHeaders)
                else:
                    return Response("Failed to add email", status=500)
            else:
                return Response("Email not provided", status=400)
        elif method == "POST":
            return Response("Invalid password", status=401)
        elif method == "DELETE" and password and validate_pw(password):
            if getter[0] == "mailinglist":
                email = query_dict.get("email", [""])[0]
                result = await delete_email(email, self.env.BLIP_DATABASE)
                if result:
                    return Response("Email deleted", status=200, headers=corsHeaders)
                else:
                    return Response("Failed to delete email", status=500)
        elif method == "OPTIONS":
            return Response("", headers=corsHeaders)
