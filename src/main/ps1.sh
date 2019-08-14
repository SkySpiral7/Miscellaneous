#!/bin/bash

#see pl version for implementation notes

#this ps1 in a git repo has "real" between 0m2.138s to 0m2.331s (mostly around 2.160 s)
#this ps1 outside a git repo has "real" between 0m1.275s to 0m1.315s (mostly around 1.284 s)

PROMPT=

RED="$(tput setaf 1)"
#red means very important: address immediately
YELLOW="$(tput setaf 3)"
#yellow means take action (but not as important as red)
GREEN="$(tput setaf 2)"
#green means important to the actions you are currently taking
CYAN="$(tput setaf 6)"
#cyan means noteworthy but not as important as green
CLEAR="$(tput setaf 9)"
#white means extra information that you can generally ignore
DELIMITER='='

perl-replace-regex() {
local perl_program="$(cat << 'LITERAL_HERE_DOC'
my $input = $ARGV[0];
my $search = $ARGV[1];
my $replacement = $ARGV[2];
$input =~ s/$search/$replacement/g;
print $input;
LITERAL_HERE_DOC
)"
perl -e "$perl_program" "$1" "$2" "$3";
}

append_git() {
   local git_status="`git status -unormal 2>&1`"
   if ! [[ "$git_status" =~ 'Not a git repo' ]]; then

      PROMPT+="branch${DELIMITER}"
      if [[ "$git_status" =~ 'On branch '([^[:space:]]+) ]]; then
         local branch="${BASH_REMATCH[1]}"
         PROMPT+="${GREEN}${branch}${CLEAR}"
      elif [[ "$git_status" =~ 'HEAD detached at '([^[:space:]]+) ]]; then
         local branch="${BASH_REMATCH[1]}"
         PROMPT+="${YELLOW}${branch}${CLEAR}"
      else
         local currentHash="$(git rev-parse HEAD 2>/dev/null)"
         PROMPT+="${RED}${currentHash:0:7}${CLEAR}"
         #this is red because it should be unreachable (even though the currentHash is correct)
      fi
      #echo "${branch}"

      PROMPT+=" status${DELIMITER}"
      if [[ "$git_status" =~ 'rebase in progress' ]]; then
         PROMPT+="${RED}rebasing${CLEAR}"
      elif [[ "$git_status" =~ 'You have unmerged paths' ]]; then
         PROMPT+="${RED}merging${CLEAR}"
      elif [[ "$git_status" =~ 'Changes to be committed' ]]; then
         PROMPT+="${GREEN}staged${CLEAR}"
      elif [[ "$git_status" =~ 'Changes not staged for commit' ]]; then
         PROMPT+="${CYAN}modified${CLEAR}"
      elif [[ "$git_status" =~ 'Untracked files' ]]; then
         PROMPT+="${YELLOW}untracked${CLEAR}"
      else
         PROMPT+="clean"
      fi

      PROMPT+=" upstream${DELIMITER}"
      if [[ "$git_status" =~ 'the upstream is gone' ]]; then
         PROMPT+="${CYAN}gone${CLEAR}"
      elif [[ "$git_status" =~ 'have diverged' ]]; then
         PROMPT+="${RED}out of sync${CLEAR}"
      elif [[ "$git_status" =~ "Your branch is ahead of '"[^\']+"' by "([0-9]+) ]]; then
         PROMPT+="${GREEN}you're ahead ${BASH_REMATCH[1]}${CLEAR}"
      elif [[ "$git_status" =~ "Your branch is behind '"[^\']+"' by "([0-9]+) ]]; then
         PROMPT+="${YELLOW}you're behind ${BASH_REMATCH[1]}${CLEAR}"
      elif [[ "$git_status" =~ 'is up to date with' ]]; then
         PROMPT+="matches"
      else
         PROMPT+="${CYAN}none${CLEAR}"
      fi

      local log_status="$(git log --pretty=format:'%d %cr %s' -1)"
      local heads="$(echo "${log_status}" | grep --only-matching -P '^.*?\)')"
      log_status="$(echo "${log_status:${#heads}+1}")"
      local commitDate="$(echo "${log_status}" | grep --only-matching -P '^.+? ago ')"
      local commitMessage="$(echo "${log_status:${#commitDate}-1}")"

      if [ "${heads}" ]; then
         local headIndex=$((${#heads}-1))
         heads="${heads:0:${headIndex}}"
         if [[ "${heads}" =~ "HEAD -> " ]]; then
            heads=${heads:10}
            #echo "head 1: $heads"
            #heads="$(perl-replace-regex "${heads}" "^[\\w-]+(.*)$" "\1")"
            #echo "head 2: $heads"
         fi
         if [[ "${heads}" =~ "HEAD, " ]]; then
            heads=${heads:8}
         fi
         PROMPT+=" heads${DELIMITER}${CYAN}${heads}${CLEAR}"
      fi

      local dateIndex=$((${#commitDate}-4))
      PROMPT+=" ago${DELIMITER}${commitDate:0:${dateIndex}}"

      commitMessage="${commitMessage:1}"
      if [ "${#commitMessage}" -gt 73 ]; then
         commitMessage="${commitMessage:0:70}..."
      fi
      PROMPT+="\ncommit${DELIMITER}${commitMessage}\n"
   fi
}
append_path() {
   local path="$(pwd)"
   PROMPT+="${CYAN}${path}${CLEAR}\n"
}

PROMPT="\n"
append_path

if [ "${USER}" = "root" ]; then
   #This stands out from $ as much as possible
   PROMPT+="${RED}With great power comes great responsibility:${CLEAR}"
else
   append_git
   PROMPT+="$"
fi

echo -e "${PROMPT} "
