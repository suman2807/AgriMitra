@echo off
setlocal enabledelayedexpansion

for /L %%d in (1,1,11) do (

    REM ~70% active days (few gaps)
    set /a chance=!random! %% 10
    if !chance! GEQ 3 (

        REM 1 to 4 commits per day
        set /a commits=!random! %% 4 + 1

        for /L %%c in (1,1,!commits!) do (

            set day=%%d
            if !day! LSS 10 set day=0!day!

            REM realistic time (10 AM – 9 PM)
            set /a hour=!random! %% 11 + 10
            set /a min=!random! %% 60

            echo 03-%%d-%%c >> file.txt
            git add .

            set DATE=2026-03-!day! !hour!:!min!:00
            set GIT_AUTHOR_DATE=!DATE!
            set GIT_COMMITTER_DATE=!DATE!

            set /a r=!random! %% 8

            if !r! EQU 0 git commit -m "added new feature enhancement"
            if !r! EQU 1 git commit -m "improved UI responsiveness"
            if !r! EQU 2 git commit -m "fixed bugs in functionality"
            if !r! EQU 3 git commit -m "refactored code structure"
            if !r! EQU 4 git commit -m "optimized performance"
            if !r! EQU 5 git commit -m "updated styling"
            if !r! EQU 6 git commit -m "cleaned up code"
            if !r! EQU 7 git commit -m "updated documentation"
        )
    )
)