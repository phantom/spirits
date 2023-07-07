# Spirit Jump

https://spiritjump.netlify.app/

## Game

- r3f
- three js
- zustand
- ...

To run locally

```
yarn web
```

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
