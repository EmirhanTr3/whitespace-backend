const json = {
  "model": "Guild",
  "operation": "create",
  "args": {
    "data": {
      "name": "test",
      "ownerId": "136520417996177408",
      "members": {
        "create": {
          "userId": "136520417996177408"
        }
      },
      "channels": {
        "create": {
          "name": "General"
        }
      }
    }
  },
  "__internalParams": {
    "args": {
      "data": {
        "name": "test",
        "ownerId": "136520417996177408",
        "members": {
          "create": {
            "userId": "136520417996177408"
          }
        },
        "channels": {
          "create": {
            "name": "General"
          }
        }
      }
    },
    "dataPath": [],
    "action": "create",
    "model": "Guild",
    "clientMethod": "guild.create",
    "jsModelName": "guild",
    "callsite": {
      "_error": {}
    }
  }
}

for (const data in json.args.data) {
    console.log(data)
    for (const dataField in json.args.data[data]) {
        console.log(data, dataField)
        if (dataField == "create") {
            console.log(json.args.data[data].create)
            json.args.data[data].create.id = "generatedid"
        }
    }
}

console.log(json.args.data)