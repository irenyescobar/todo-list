import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { TodoKeyLocalStorage } from 'src/app/models/enum/todoKeyLocalStorage';
import { Todo } from 'src/app/models/model/todo.model';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-todo-card',
    standalone: true,
    templateUrl: './todo-card.component.html',
    styleUrls: [],
    imports: [
        NgFor,
        NgIf,
        NgTemplateOutlet,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        HeaderComponent
    ]
})
export class TodoCardComponent implements OnInit {
  private todoSignalsService = inject(TodoSignalsService);
  private todosSignal = this.todoSignalsService.todosState;
  public todosList = computed(() => this.todosSignal());

  constructor(){
    effect(() => {
      console.log('',this.todoSignalsService.todosState());
    });
  }

  public ngOnInit(): void {
    this.getTodosInLocalStorage();
  }

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private saveTodosInLocalStorage(): void {
     this.todoSignalsService.saveTodosLocalStorage();
  }

  public handleDoneTodo(todoId: number): void {
    if(todoId){
      this.todosSignal.mutate((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;
        todoSelected && (todoSelected.done = true);
        this.saveTodosInLocalStorage();
      });
    }
  }

  public handleDeleteTodo(todo: Todo): void {
    if(todo){
      const index = this.todosList().indexOf(todo);
      if(index !== -1){
        this.todosSignal.mutate((todos) => {
          todos.splice(index,1);
          this.saveTodosInLocalStorage();
        });
      }
    }
  }

}
