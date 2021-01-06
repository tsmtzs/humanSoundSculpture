# Contributing to *Human Sound Sculpture*
To contribute to this project you can

- *Report bugs or errors*\
  For this, please, open an issue.
- *Suggest improvements or bug fixes*\
  We follow a branching mode similar to
	[git-flow](https://nvie.com/posts/a-successful-git-branching-model/).
	In short, there are always two branches
	- `master`: Code in this branch should reflect a *stable release* of the piece.
	- `develop`: This branch is used for development. We only merge the `develop`
		branch to `master`.

	Bug fixes and new features are addressed by creating new branches on top of `develop`
	except from very simple issues.
	We use one branch per bug/feature. To name these branches we follow the next scheme:
	the string `topic/` is followed by a more specific description. E.x. to add some
	`CSS` improvements we might name the new branch as `topic/css-enhancements`. `topic/`
	branches should be merged only to `develop`. Commit messages start with a one line
	short description. We prefer to not end the first line of a commit message with
	a period.

	For performances, tests or just for having fun with the piece we make branches on top
	of `master`. We don't merge these. It might be convenient to name the branches of this
	category as `test@raspberry`, `performance@blackHole` etc.
