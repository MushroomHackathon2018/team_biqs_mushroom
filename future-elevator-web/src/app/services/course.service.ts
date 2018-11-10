import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {


  api  = environment.apiUrl + "/api/course/";

  constructor(private httpClient: HttpClient) { 

  }
  /**
   * 登录
   * @param name 
   * @param pass 
   */
  login(name,pass): Observable<any> {
    return this.httpClient.get(`${this.api}login`,{
      params:{
        name:name,
        pass:pass
      }
    });
  }
  logout(): Observable<any>{
    return this.httpClient.get(`${this.api}logout`,{  withCredentials: true });
  }
    /**
   * 学生列表
   */
  students(): Observable<any> {
    return this.httpClient.get(`${this.api}students`)
  }

  studentsTrain(): Observable<any> {
    return this.httpClient.get(`${this.api}person_ids`);
  }

  deleteFace(personId): Observable<any> {
    return this.httpClient.get(`${this.api}delete_face`,{
      params:{
        personId:personId
      }
    });
  }

  status(personId): Observable<any> {
    return this.httpClient.get(`${this.api}status`,{
      params:{
        personId:personId
      }
    });
  }

  allStatus(): Observable<any>{
    return this.httpClient.get(`${this.api}all_status`);
  }

  /**
   * 获取系统消息
   */
  info(): Observable<any> {
    return this.httpClient.get(`${this.api}info`)
  }
  /**
   * 回答问题
   * @param personId 
   * @param question 
   * @param answer 
   */
  answer(personId,question,answer): Observable<any> {
    return this.httpClient.get(`${this.api}answer`,{
      params:{
        personId:personId,
        question:question,
        answer:answer
      }
    });
  }
  /**
   * 
   * @param quesion 回答过问题的学生
   */
  answerStudents(question): Observable<any> {
    return this.httpClient.get(`${this.api}answer_students`,{
      params:{
        question:question
      }
    });
  }

  sendQuestion(question): Observable<any> {
    return this.httpClient.get(`${this.api}send_question`,{
      params:{
        question:question
      }
    });
  }

  sendAnswer(question,personId): Observable<any> {
    return this.httpClient.get(`${this.api}send_answer`,{
      params:{
        question:question,
        personId:personId
      }
    });
  }

  user(): Observable<any> {
    return this.httpClient.get(`${this.api}user`,{  withCredentials: true })
  }

}
