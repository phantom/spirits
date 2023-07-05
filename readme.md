- hide leva on prod, not on dev. make it appear using a script
- X make camera follow the player
- X click movement
  - Still scuffed though
- level editor (transform controls?)
- line that follows the player - green is up, red is down - mimicking a graph lol
- player stuff should be calculated with delta
- if moving in a certain direction and jumping, remain the x velocity from before the jump
- force portrait mode

# Backend Airdropper 🪂

```
// Deploy a function
npx supabase functions deploy sweepstakes --project-ref <project_ref>

// Set secrets
npx supabase secrets set --env-file ./supabase/.env

// New Function
npx supabase functions new postgres
```

### Developing in VSCode
Add the following to your .vscode settings.json.
```
{
  "deno.enablePaths": ["./supabase"],
  "deno.unstable": true,
  "deno.importMap": "/Users/mitchell.catoen/Documents/workspace/supabase/supabase/functions/import_map.json"
}

```