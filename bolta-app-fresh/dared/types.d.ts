type SignInUser = {
    email: string,
    password: string
}

type RegisteredUser = {
    uid: string,
    email: string,
    username: string
}
enum VoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE',
    UNVOTE = "UNVOTE"
  }
type Vote = {
    submissionId: string,
    voteType: VoteType,
}

interface ContextUser {
    uid: string,
    email: string,
    challenge: Challenge | null,
    username: string,
    seenChallenges: string[],
    didChallenges: string[],
    hasDoneTodays: boolean,
    usersDoneChallengePosts: ChallengePost[],
    seenTodays: boolean,
    profilePictureUrl?: string,
    votes: Vote[]
}
type Challenge = {
    challenge: string,
    challengeId: string
}

type CommentDTO = {
    commentId: string;
    likes: string[];
    uid: string;
    text: string;
    userName: string;
    createdAt: FieldValue; 
  };

type PostComment = {
    uid: string,
    commentText: string,
    username: string,
    submissionId: string,
    createdAt: Date | {nanoseconds: number, seconds: number},
    likes: string[],
    commentId: string
}

type ChallengePost = {
    submissionId: string,
    challengeId: string,
    challenge: string,
    userId: string,
    imageUrl: string,
    username: string,
    profilePictureUrl: string,
    postingTime: {
        nanoseconds: number,
        seconds: number
    },
    upvotes: string[],
    downvotes: string[],
    comments: PostComment[],
    caption: string
}


