from workers import Response, WorkerEntrypoint
import json
from urllib.parse import urlparse, parse_qs
from submodule import get_info, validate_pw, get_mailinglist

class Default(WorkerEntrypoint):
    async def fetch(self, request):
        parsed_url = urlparse(request.url)
        query_dict = parse_qs(parsed_url.query)
        method = request.method
        if method == "GET":
            getter = query_dict["data"]
            if getter[0] == "info":
                return Response(json.dumps(get_info()))
            if getter[0] == "mailinglist":
                password = query_dict.get("password", [""])[0]
                if password and validate_pw(password):
                    return Response(json.dumps(get_mailinglist()))
            return Response("Invalid Request", status=400)
