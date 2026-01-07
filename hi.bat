@echo off
setlocal enabledelayedexpansion

for %%m in (01 02) do (

    for /L %%d in (1,1,31) do (

        REM ~55% active days (natural gaps)
        set /a chance=!random! %% 10
        if !chance! GEQ 5 (

            REM 1 to 4 commits per day (not too much)
            set /a commits=!random! %% 4 + 1

            for /L %%c in (1,1,!commits!) do (

                set day=%%d
                if !day! LSS 10 set day=0!day!

                REM realistic working hours (10 AM – 9 PM)
                set /a hour=!random! %% 11 + 10
                set /a min=!random! %% 60

                echo %%m-%%d-%%c >> file.txt
                git add .

                set DATE=2026-%%m-!day! !hour!:!min!:00
                set GIT_AUTHOR_DATE=!DATE!
                set GIT_COMMITTER_DATE=!DATE!

                REM JAN = setup
                if %%m==01 (
                    set /a r=!random! %% 6
                    if !r! EQU 0 git commit -m "initialized project"
                    if !r! EQU 1 git commit -m "added README"
                    if !r! EQU 2 git commit -m "setup frontend layout"
                    if !r! EQU 3 git commit -m "configured backend"
                    if !r! EQU 4 git commit -m "connected database"
                    if !r! EQU 5 git commit -m "created basic components"
                )

                REM FEB = features
                if %%m==02 (
                    set /a r=!random! %% 7
                    if !r! EQU 0 git commit -m "implemented core feature"
                    if !r! EQU 1 git commit -m "added API integration"
                    if !r! EQU 2 git commit -m "improved UI interactions"
                    if !r! EQU 3 git commit -m "added validation"
                    if !r! EQU 4 git commit -m "fixed bugs"
                    if !r! EQU 5 git commit -m "optimized performance"
                    if !r! EQU 6 git commit -m "enhanced user experience"
                )
            )
        )
    )
)