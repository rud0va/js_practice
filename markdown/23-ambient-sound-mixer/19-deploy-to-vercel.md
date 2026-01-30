# Deploy To Vercel

Now that we have completed our sound mixer, let's deploy it to https://vercel.com.

You first need to push your code to a Github repo. Run the following commands:

```bash
git init
git add .
git commit -m 'Initial Commit'
```

Now go to https://github.com and create a new repo and copy the `git remote` command. Run it in your terminal and then run:

```bash
git push -u origin main
```

Now go back to Vercel and log in with your Github account. Click on "New Project" and select your Github repo.

Click "Deploy" and wait a few seconds. It should then show a congrats page and you will get a vercel.app URL to visit your project. 

That's it! your sound mixer is live!

Anytime you push code to that repo, your live project will be updated.