/**
 * 刷新页面
 * @params 是否带进入页面的参数
*/

export default function reLoadPage(params: boolean) {
    let pages: any = getCurrentPages();
    // 获取页面栈中的上一页
    let len = pages.length;
    let currentRoute = pages[len - 1].route// 获取当前页面路由
    let currentPage = pages[len - 1]['$page']['fullPath'] //当前页面路径(带参数)
    let options = pages[len - 1].options
    uni.redirectTo({
        url: params ? currentPage : currentRoute
    });
}
