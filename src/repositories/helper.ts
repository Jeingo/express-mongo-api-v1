import {LikesInfoType, StatusLikeType} from "../models/likes-models";

export function getUpdatedLike(likesInfo: LikesInfoType, lastStatus: StatusLikeType, newStatus: StatusLikeType) {
    if (newStatus === 'None' && lastStatus === 'Like') {
        return { ...likesInfo, likesCount: --likesInfo.likesCount }
    }
    if (newStatus === 'None' && lastStatus === 'Dislike') {
        return { ...likesInfo, dislikesCount: --likesInfo.dislikesCount }
    }
    if (newStatus === 'Like' && lastStatus === 'None') {
        return { ...likesInfo, likesCount: ++likesInfo.likesCount }
    }
    if (newStatus === 'Like' && lastStatus === 'Dislike') {
        return {
            ...likesInfo,
            likesCount: ++likesInfo.likesCount,
            dislikesCount: --likesInfo.dislikesCount
        }
    }
    if (newStatus === 'Dislike' && lastStatus === 'None') {
        return { ...likesInfo, dislikesCount: ++likesInfo.dislikesCount }
    }
    if (newStatus === 'Dislike' && lastStatus === 'Like') {
        return {
            ...likesInfo,
            likesCount: --likesInfo.likesCount,
            dislikesCount: ++likesInfo.dislikesCount
        }
    }
    return likesInfo
}