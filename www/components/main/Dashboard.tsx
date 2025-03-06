"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input }  from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash, Pencil, LucidePlus, Check } from "lucide-react";
import { toast } from "sonner"
import { Select } from "@/components/ui/select";
import { format } from "date-fns";
import DatePicker from "@/components/DatePicker";
import { useRouter, useSearchParams } from "next/navigation";

type UserDataType = {
  name?: string;
  email?: string;
};

type ITodo = {
  id: string;
  description: string;
  priority: number;
  date: number;
  completed: boolean;
};

const priorities = [
  { value: 1, label: "High" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Low" },
];

type Props = {
    todos: ITodo[];
    userData: UserDataType;
    filters: {
      priority?: number;
      completed?: string;
      date?: Date;
    };
};

export default function Dashboard(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [todos, setTodos] = useState<ITodo[]>(props.todos);
  
  const [date, setDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ITodo>>({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);


  // Filters
  const [filters, setFilters] = useState<{
		priority?: number 
		completed?: string
		date?: Date
	}>(props.filters);

   
  const onChangeCb = useCallback(
		(args: { key: keyof typeof filters; value: number | string | Date }) => {
			setFilters((prev) => ({
				...prev, 
				[args.key]: args.value, 
			}));
		},
		[]
	);

  const fetchTodos = useCallback(async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    void api.get(`/task/all?${searchParams.toString()}`).then((res) => {
      setTodos(res.data);
    }).catch((error) => {
      console.error(error);
      toast.error("Error", { description: "Error while fetching tasks" });
    });
  }, [searchParams, page, limit]);

  const handleCreateOrUpdate = async () => {
    if (!formData.description || !formData.priority || !date) {
      toast.error("Error", { description: "All fields are required" });
      return;
    };
    const taskData = { ...formData, date: Math.floor(date.getTime() / 1000) };

    try {
      if (formData.id) {
        await api.patch(`/task/${formData.id}`, taskData);
      } else {
        await api.post("/task/new", taskData);
      }
      setIsDialogOpen(false);
      fetchTodos();

      toast.success("Success", { description: "Task saved successfully" });
    } catch (error) {
        console.error(error);
        toast.error("Error", { description: "Error while saving task" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/task/${id}`);
      // fetchTodos(page);
      setIsConfirmOpen(false);
      fetchTodos();
      toast.success("Success", { description: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
        toast.error("Error", { description: "Error while deleting task" });
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      await api.patch(`/task/${id}`, { completed: true });
      fetchTodos();
      toast.success("Success", { description: "Task marked as completed" });
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Error while marking task as completed" });
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };
  

  const resetFilters = () => {
    setFilters({
      priority: 0,
      completed: "",
      date: undefined,
    });
  }

   // Group tasks by date
   const groupedTodos = todos.reduce<Record<string, ITodo[]>>((acc, todo) => {
    const dateKey = format(new Date(todo.date * 1000), "PPP");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(todo);
    return acc;
  }, {});

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    const pageFromUrl = parseInt(params.get("page") || "1", 10);
    const limitFromUrl = parseInt(params.get("limit") || "5", 10);
    
    setPage(pageFromUrl);
    setLimit(limitFromUrl);

    if(filters.priority) {
      params.set("priority", filters.priority.toString());
    }else {
      params.delete("priority");
    }

    if(filters.completed !== "" && filters.completed != null) {
      params.set("completed", filters.completed.toString());
    }else {
      params.delete("completed");
    }

    if(filters.date){
      params.set("date", (Math.floor(filters.date.getTime() / 1000)).toString())
    }else {
      params.delete("date");
    };

    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();

  }, [router, searchParams, filters]);

  useEffect(() => {
    fetchTodos();
    }, [searchParams, filters, fetchTodos, page]);

  return (
    <div className="container mx-auto max-w-3xl mt-10 space-y-6">

      <div className="flex justify-between items-center">
        <h2>Welcome back, {props.userData.name}</h2>
        <Button variant="destructive" onClick={handleLogout} className="mt-4">
          Logout
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4 justify-center items-center max-sm:grid max-sm:grid-cols-2">
        <Select
          label="Priority"
          value={filters.priority}
          onChange={(e) => onChangeCb({ key: "priority", value: e.currentTarget.value ? Number(e.currentTarget.value) : 0 })}
          options={[{ value: "", label: "All" }, ...priorities]}
        />
        <Select
          label="Completed"
          value={filters.completed}
          onChange={(e) => onChangeCb({ key: "completed", value: e.currentTarget.value ? (e.currentTarget.value === "true" ? "true" : "false") : "" })}
          options={[{ value: "", label: "All" }, { value: "true", label: "Completed" }, { value: "false", label: "Incomplete" }]}
        />
        <DatePicker label="Filter by Date" allowPastDates={true} selectedDate={filters.date} onDateChange={(date) => onChangeCb({ key: "date", value: date || new Date() })} />
        <Button onClick={resetFilters} className="mt-5">
          Reset Filters
        </Button>
      </div>


      {/* Grouped Tasks */}
      {Object.keys(groupedTodos).map((dateKey) => (
        <div key={dateKey} className="space-y-2">
          <h2 className="text-lg font-semibold">{dateKey}</h2>
          <div className="space-y-3">
            {groupedTodos[dateKey].map((todo) => (
              <Card key={todo.id} className="flex items-center justify-between p-4">
                <div>
                  <h3
                    className={`font-medium ${todo.completed ? "line-through text-gray-400" : ""}`}
                  >
                    {todo.description}
                  </h3>
                  <p className="text-sm text-gray-500">Priority: {todo.priority}</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    size="icon"
                    className={`hover:bg-green-600 ${todo.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !todo.completed && markAsCompleted(todo.id)}
                    disabled={todo.completed}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setFormData(todo);
                      setDate(new Date(todo.date * 1000));
                      setIsDialogOpen(true);
                    }}
                    disabled={todo.completed} // Prevent editing if completed
                    className={todo.completed ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setTodoToDelete(todo.id);
                      setIsConfirmOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}


      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        

        <div className="flex items-center space-x-4">
        <Select
          label="Tasks per page"
          value={limit.toString()}
          onChange={(e) => {
            const newLimit = parseInt(e.currentTarget.value, 10);
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
            const params = new URLSearchParams(searchParams.toString());
            params.set("limit", newLimit.toString());
            params.set("page", "1");
            router.push(`?${params.toString()}`, { scroll: false });
            router.refresh();
          }}
          options={[
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "15", label: "15" },
            { value: "20", label: "20" },
          ]}
        />

        <Input
          label="Page"
          type="number"
          value={page.toString()}
          min="1"
          onChange={(e) => {
            const newPage = parseInt(e.currentTarget.value, 10);

            if (isNaN(newPage) || newPage <= 0) {
              toast.error("Invalid page", { description: "Page must be a positive number." });
              return;
            }

            setPage(newPage);
          }}
          onBlur={(e) => {
            // Ensure valid page number on blur
            const newPage = parseInt(e.target.value, 10);
            if (!newPage || newPage <= 0) {
              setPage(1);
              toast.error("Invalid input", { description: "Page reset to 1." });
            } else {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", newPage.toString());
              router.push(`?${params.toString()}`, { scroll: false });
              router.refresh();
            }
          }}
          className="w-14 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-center"
        />

        </div>


        <Button onClick={() => handlePageChange(page + 1)} disabled={todos.length < limit}>
          Next
        </Button>
      </div>

      {/* Create Task Button */}
      <Button
        onClick={() => {
          setFormData({});
          setDate(undefined);
          setIsDialogOpen(true);
        }}
        className="fixed bottom-12 right-12 w-12 h-12 rounded-full flex items-center justify-center"
      >
        <LucidePlus className="w-6 h-6" />
      </Button>

      {/* Create / Update Task Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>{formData.id ? "Edit Task" : "New Task"}</DialogTitle>

          {/* Task Description */}
          <Input
            label="Description"
            placeholder="Task Description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
            className="mt-2"
          />

          {/* 2nd Line: DatePicker & Priority Select */}
          <div className="flex gap-4 mt-3">
            {/* Date Picker */}
            <div className="flex-1">
              <DatePicker label="Select Date" allowPastDates={false} selectedDate={date} onDateChange={setDate} />
            </div>

            {/* Priority Select */}
            <div className="flex-1">
              <Select
                label="Priority"
                value={formData.priority || ""}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.currentTarget.value) })}
                options={priorities}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button onClick={handleCreateOrUpdate} className="mt-4 w-full">
            {formData.id ? "Update Task" : "Create Task"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p id="dialog-description" className="text-sm text-gray-500">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(todoToDelete!)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
